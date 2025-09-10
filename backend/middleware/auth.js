const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        projects: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Project ownership authorization
const authorizeProjectOwner = async (req, res, next) => {
  try {
    const projectId = parseInt(req.params.projectId || req.body.projectId);
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID required' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Allow project owner or admin
    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to access this project' });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project authorization error:', error);
    res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Rate limiting middleware
const rateLimit = (windowMs, max) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, value] of requests.entries()) {
      if (value.timestamp < windowStart) {
        requests.delete(key);
      }
    }

    // Check current requests
    const userRequests = requests.get(ip) || { count: 0, timestamp: now };
    
    if (userRequests.timestamp < windowStart) {
      userRequests.count = 1;
      userRequests.timestamp = now;
    } else {
      userRequests.count++;
    }

    requests.set(ip, userRequests);

    if (userRequests.count > max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((windowStart + windowMs - now) / 1000)
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeProjectOwner,
  rateLimit
};
