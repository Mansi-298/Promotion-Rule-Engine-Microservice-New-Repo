# REST Express Gaming Promotion Engine

## Overview

Used Express.js backend that serves as a promotion engine for gaming applications. The system evaluates player attributes against configurable rules to determine promotional offers in real-time. It features a comprehensive API documentation interface, live metrics dashboard, and dynamic rule configuration system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Structure
The application follows a monorepo structure with clear separation between client, server, and shared code:
- **Backend**: Express.js server with TypeScript
- **Shared**: Common schemas and types using Zod for validation

### Technology Stack
- **Backend Framework**: Express.js with TypeScript

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

### Configuration Management
- Environment variables for database connections
- Separate development and production configurations
- YAML-based rule configuration for business logic
- CSS variables for consistent theming

The architecture prioritizes modularity, type safety, and real-time performance monitoring while maintaining a clear separation of concerns between business logic, data persistence, and user interface components.
