const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRole, authorizeProjectOwner } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for GIS file uploads
const storage = multer.diskStorage({
  destination: './uploads/gis/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Ensure uploads directory exists
const uploadsDir = './uploads/gis/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/json', // GeoJSON
      'application/geo+json',
      'application/zip', // Shapefile
      'application/octet-stream'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.geojson')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only GeoJSON and Shapefile formats are allowed.'), false);
    }
  }
});

// Get all projects (public endpoint with filtering)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      ecosystemType,
      location,
      ownerId
    } = req.query;

    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (ecosystemType) whereClause.ecosystemType = ecosystemType;
    if (location) whereClause.location = { contains: location };
    if (ownerId) whereClause.ownerId = ownerId;

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              organization: true
            }
          },
          verifications: {
            select: {
              status: true,
              reviewDate: true
            }
          },
          creditBatches: {
            select: {
              id: true,
              amount: true,
              retired: true
            }
          },
          _count: {
            select: {
              verifications: true,
              creditBatches: true
            }
          }
        },
        skip: offset,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.project.count({ where: whereClause })
    ]);

    // Calculate summary statistics
    const projectsWithStats = projects.map(project => ({
      ...project,
      totalCreditsIssued: project.creditBatches.reduce((sum, batch) => sum + batch.amount, 0),
      creditsRetired: project.creditBatches.filter(batch => batch.retired).reduce((sum, batch) => sum + batch.amount, 0),
      verificationStatus: project.verifications.length > 0 
        ? project.verifications[project.verifications.length - 1].status 
        : 'PENDING'
    }));

    res.json({
      projects: projectsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            organization: true,
            email: true
          }
        },
        verifications: {
          include: {
            verifier: {
              select: {
                id: true,
                name: true,
                organization: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        creditBatches: {
          include: {
            transactions: {
              select: {
                type: true,
                amount: true,
                createdAt: true
              }
            }
          }
        },
        auditReports: {
          include: {
            auditor: {
              select: {
                name: true,
                organization: true
              }
            }
          },
          orderBy: { auditDate: 'desc' }
        },
        satelliteData: {
          orderBy: { acquisitionDate: 'desc' },
          take: 10 // Latest 10 satellite data points
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', authenticateToken, authorizeRole('PROJECT_OWNER'), upload.single('gisFile'), async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      area,
      ecosystemType,
      startDate,
      endDate,
      estimatedCO2,
      gisData
    } = req.body;

    // Validation
    if (!name || !location || !area || !ecosystemType || !startDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'location', 'area', 'ecosystemType', 'startDate']
      });
    }

    // Validate ecosystem type
    const validEcosystemTypes = ['MANGROVE', 'SEAGRASS', 'WETLAND', 'SALT_MARSH'];
    if (!validEcosystemTypes.includes(ecosystemType)) {
      return res.status(400).json({
        error: 'Invalid ecosystem type',
        validTypes: validEcosystemTypes
      });
    }

    // Process GIS data
    let processedGisData = null;
    if (req.file) {
      // For file upload, store file path
      processedGisData = {
        type: 'file',
        path: req.file.path,
        filename: req.file.filename,
        originalName: req.file.originalname
      };
    } else if (gisData) {
      // For direct JSON data
      try {
        processedGisData = JSON.parse(gisData);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid GIS data format' });
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        location,
        area: parseFloat(area),
        ecosystemType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        estimatedCO2: estimatedCO2 ? parseFloat(estimatedCO2) : null,
        gisData: processedGisData,
        ownerId: req.user.id,
        status: 'SUBMITTED'
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            organization: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:projectId', authenticateToken, authorizeProjectOwner, async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      area,
      ecosystemType,
      startDate,
      endDate,
      estimatedCO2
    } = req.body;

    // Check if project can be updated
    if (req.project.status === 'VERIFIED' || req.project.status === 'ACTIVE') {
      return res.status(400).json({
        error: 'Cannot update verified or active projects',
        currentStatus: req.project.status
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.projectId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(location && { location }),
        ...(area && { area: parseFloat(area) }),
        ...(ecosystemType && { ecosystemType }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(estimatedCO2 && { estimatedCO2: parseFloat(estimatedCO2) }),
        updatedAt: new Date()
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            organization: true
          }
        }
      }
    });

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:projectId', authenticateToken, authorizeProjectOwner, async (req, res) => {
  try {
    // Check if project can be deleted
    if (req.project.status === 'VERIFIED' || req.project.status === 'ACTIVE') {
      return res.status(400).json({
        error: 'Cannot delete verified or active projects',
        currentStatus: req.project.status
      });
    }

    // Check if project has credit batches
    const creditBatches = await prisma.creditBatch.count({
      where: { projectId: req.params.projectId }
    });

    if (creditBatches > 0) {
      return res.status(400).json({
        error: 'Cannot delete project with issued credit batches'
      });
    }

    // Delete associated files
    if (req.project.gisData && req.project.gisData.path) {
      try {
        fs.unlinkSync(req.project.gisData.path);
      } catch (e) {
        console.warn('Could not delete GIS file:', e.message);
      }
    }

    // Delete project and related data
    await prisma.project.delete({
      where: { id: req.params.projectId }
    });

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Get project statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        creditBatches: {
          include: {
            transactions: true
          }
        },
        satelliteData: {
          orderBy: { acquisitionDate: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Calculate statistics
    const totalCreditsIssued = project.creditBatches.reduce((sum, batch) => sum + batch.amount, 0);
    const creditsRetired = project.creditBatches.filter(batch => batch.retired).reduce((sum, batch) => sum + batch.amount, 0);
    const creditsAvailable = totalCreditsIssued - creditsRetired;
    
    const totalTransactions = project.creditBatches.reduce((sum, batch) => sum + batch.transactions.length, 0);
    const totalRevenue = project.creditBatches.reduce((sum, batch) => {
      const batchRevenue = batch.transactions
        .filter(tx => tx.type === 'PURCHASE')
        .reduce((txSum, tx) => txSum + (tx.totalValue || 0), 0);
      return sum + batchRevenue;
    }, 0);

    // Latest satellite data
    const latestSatelliteData = project.satelliteData.slice(0, 5);

    res.json({
      projectId: project.id,
      statistics: {
        totalCreditsIssued,
        creditsRetired,
        creditsAvailable,
        totalTransactions,
        totalRevenue,
        co2Captured: project.actualCO2 || project.estimatedCO2 || 0,
        projectArea: project.area
      },
      latestSatelliteData
    });

  } catch (error) {
    console.error('Error fetching project statistics:', error);
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
});

module.exports = router;
