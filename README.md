# REST Express Gaming Promotion Engine

## Overview

This is a full-stack web application built with a modern React frontend and Express.js backend that serves as a promotion engine for gaming applications. The system evaluates player attributes against configurable rules to determine promotional offers in real-time. It features a comprehensive API documentation interface, live metrics dashboard, and dynamic rule configuration system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Structure
The application follows a monorepo structure with clear separation between client, server, and shared code:
- **Frontend**: React application with TypeScript using Vite for development and build
- **Backend**: Express.js server with TypeScript
- **Shared**: Common schemas and types using Zod for validation
- **Database**: PostgreSQL with Drizzle ORM for data management

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Backend Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas for runtime type checking
- **Build Tools**: Vite for frontend, esbuild for backend bundling

## Key Components

### Backend Services
1. **Rule Engine Service** (`server/services/ruleEngine.ts`)
   - Singleton pattern for managing promotion rules
   - Loads rules from YAML configuration files
   - Evaluates player attributes against rule conditions
   - Supports operators: equals, greaterThan, lessThan, contains

2. **Metrics Service** (`server/services/metricsService.ts`)
   - Tracks API usage statistics
   - Monitors evaluation performance
   - Calculates hit rates and response times

3. **Storage Layer** (`server/storage.ts`)
   - Abstracted storage interface supporting in-memory storage
   - Manages rules, metrics, and evaluation data
   - Designed for easy extension to persistent storage solutions

### Frontend Components
1. **API Documentation Interface** (`client/src/pages/api-documentation.tsx`)
   - Interactive API testing environment
   - Real-time request/response visualization
   - Built-in example payloads

2. **Metrics Dashboard** (`client/src/components/metrics-dashboard.tsx`)
   - Live performance monitoring with 5-second refresh intervals
   - Visual charts showing success rates and response times
   - Real-time statistics display

3. **Rules Configuration** (`client/src/components/rules-config.tsx`)
   - YAML-based rule management interface
   - Hot reloading of rule configurations
   - Validation and error reporting

### API Endpoints
1. **POST /api/promotion** - Main promotion evaluation endpoint
2. **GET /api/metrics** - Performance metrics retrieval
3. **POST /api/reload** - Dynamic rule reloading

## Data Flow

### Promotion Evaluation Flow
1. Client sends player attributes via POST to `/api/promotion`
2. Request validation using Zod schemas
3. Rule engine evaluates player against loaded rules by priority
4. First matching rule triggers promotion response
5. Metrics tracking for all requests (success/failure/timing)
6. Response with promotion details or 204 if no match

### Rule Management Flow
1. Rules defined in external `rules.yaml` file
2. YAML parsing and validation against defined schemas
3. Hot reloading capability through `/api/reload` endpoint
4. In-memory storage with singleton pattern for performance

### Metrics Collection Flow
1. Automatic tracking of all API requests
2. Response time measurement for performance analysis
3. Success/failure rate calculation
4. Real-time dashboard updates via polling

## External Dependencies

### Database Integration
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **connect-pg-simple**: PostgreSQL session store for Express

### UI Framework Dependencies
- **Radix UI**: Comprehensive component primitives for accessibility
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Strong typing across the entire stack
- **Vite**: Fast development server with hot module replacement
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot reloading
- Express server with tsx for TypeScript execution
- Automatic error overlay for development debugging
- File system routing and middleware setup

### Production Build
1. Frontend: Vite builds to optimized static assets
2. Backend: ESBuild bundles server code to single executable
3. Static file serving through Express in production
4. Environment-based configuration management

### Configuration Management
- Environment variables for database connections
- Separate development and production configurations
- YAML-based rule configuration for business logic
- CSS variables for consistent theming

The architecture prioritizes modularity, type safety, and real-time performance monitoring while maintaining a clear separation of concerns between business logic, data persistence, and user interface components.