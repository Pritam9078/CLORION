# CLORIT - Blockchain-Based Blue Carbon Registry and MRV System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
CLORIT is a blockchain-based blue carbon registry and Monitoring, Reporting, and Verification (MRV) system for carbon credit management. The system enables project registration, satellite-based verification, and tokenized carbon credit trading.

## Key Technologies
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, App Router
- **Backend**: Express.js with Node.js, PostgreSQL with PostGIS for spatial data
- **Blockchain**: Ethereum smart contracts (Solidity), Web3.js/Ethers.js
- **Authentication**: Role-based access control (Project Owner, Verifier, Trader, Admin)
- **Satellite Integration**: NDVI/EVI APIs for vegetation monitoring
- **Database**: PostgreSQL with PostGIS for GIS data storage

## Architecture Components
1. **Authentication Layer**: Multi-role user management
2. **Project Registration**: GIS boundary upload, metadata management
3. **MRV System**: Satellite API integration, government audit workflows
4. **Blockchain Integration**: ERC-1155 token contracts for carbon credits
5. **Marketplace**: Trading platform for carbon credits
6. **Dashboard**: Role-based views and public transparency layer

## Code Guidelines
- Use TypeScript strict mode for type safety
- Follow Next.js App Router patterns
- Implement proper error handling and validation
- Use environment variables for sensitive configurations
- Follow RESTful API design patterns
- Implement proper Web3 integration with wallet connectivity
- Use proper spatial data handling with PostGIS
- Implement role-based authorization middleware
- Follow blockchain best practices for smart contract interactions

## Database Schema
- Projects table with PostGIS geometry fields
- Users table with role-based access
- Verifications table for audit trails
- Credits table for tokenized carbon credits
- Transactions table for marketplace activities

## Security Considerations
- Implement proper input validation
- Use parameterized queries for database operations
- Secure API endpoints with proper authentication
- Validate blockchain transactions
- Implement rate limiting
- Follow OWASP security guidelines
