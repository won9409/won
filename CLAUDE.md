# CLAUDE.md - Assignment Service Codebase Guide

## Project Overview

This is an **Assignment Service** - a REST API service for managing assignments (과제 관리). It provides functionality for creating, reading, updating, and deleting assignments, with support for tracking assignment status, due dates, and automatic overdue detection.

**Primary Language**: The codebase is in English, but the domain context is Korean (한국어). The README and some documentation use Korean terms.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript 5.0+ (strict mode enabled)
- **Framework**: Express.js 4.18
- **Architecture Pattern**: MVC (Model-View-Controller)
- **Data Storage**: In-memory (Map-based storage)
- **Package Manager**: npm
- **Build Tool**: TypeScript Compiler (tsc)

## Codebase Architecture

The project follows a clean, layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                   HTTP Request                       │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Routes Layer (assignment.routes.ts)                 │
│  - Route definitions and router setup                │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Controller Layer (AssignmentController.ts)          │
│  - Request/Response handling                         │
│  - Input validation                                  │
│  - Error handling                                    │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Service Layer (AssignmentService.ts)                │
│  - Business logic                                    │
│  - Data manipulation                                 │
└───────────────────┬─────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Model Layer (Assignment.ts)                         │
│  - Type definitions (interfaces)                     │
│  - DTOs (Data Transfer Objects)                      │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
/home/user/won/
├── src/
│   ├── index.ts                      # Application entry point
│   ├── models/
│   │   └── Assignment.ts             # Data models and DTOs
│   ├── services/
│   │   └── AssignmentService.ts      # Business logic layer
│   ├── controllers/
│   │   └── AssignmentController.ts   # Request handlers
│   └── routes/
│       └── assignment.routes.ts      # Route definitions
├── dist/                              # Compiled JavaScript output
├── node_modules/                      # Dependencies
├── package.json                       # Project metadata and scripts
├── tsconfig.json                      # TypeScript configuration
├── .gitignore                        # Git ignore rules
└── README.md                         # Project documentation (Korean)
```

### Key Files Explained

#### `src/index.ts` (Entry Point)
- Sets up Express application
- Configures middleware (JSON parsing, URL encoding)
- Registers routes under `/api/assignments`
- Provides health check endpoint at `/health`
- Starts HTTP server on port 3000 (or PORT env var)

#### `src/models/Assignment.ts` (Data Models)
Defines three interfaces:
- **Assignment**: Complete assignment entity with all fields
- **CreateAssignmentDto**: Data required to create a new assignment
- **UpdateAssignmentDto**: Partial data for updating assignments

#### `src/services/AssignmentService.ts` (Business Logic)
Core business logic class with methods:
- `createAssignment()`: Creates new assignment with UUID
- `getAssignmentById()`: Retrieves single assignment
- `getAllAssignments()`: Returns all assignments
- `getAssignmentsByStatus()`: Filters by status
- `getAssignmentsByAssignee()`: Filters by assignedTo
- `getAssignmentsByCreator()`: Filters by createdBy
- `updateAssignment()`: Updates assignment fields
- `deleteAssignment()`: Removes assignment
- `updateOverdueAssignments()`: Auto-updates overdue status

**Storage**: Uses `Map<string, Assignment>` for in-memory storage

#### `src/controllers/AssignmentController.ts` (Request Handlers)
Handles HTTP requests and responses:
- Validates input data
- Calls service methods
- Returns appropriate HTTP status codes
- Handles errors with try-catch blocks

#### `src/routes/assignment.routes.ts` (Routing)
Defines REST API endpoints:
- `POST /` - Create assignment
- `GET /` - Get all (with optional query filters)
- `GET /:id` - Get by ID
- `PUT /:id` - Update assignment
- `DELETE /:id` - Delete assignment
- `POST /update-overdue` - Update overdue statuses

## Data Model

### Assignment Status Flow
```
pending → in_progress → completed
   ↓
overdue (if dueDate passed and not completed)
```

### Assignment Interface
```typescript
{
  id: string;                    // UUID (auto-generated)
  title: string;                 // Assignment title (required)
  description: string;           // Assignment description (required)
  dueDate: Date;                 // Deadline (required)
  createdAt: Date;               // Creation timestamp (auto)
  updatedAt: Date;               // Last update timestamp (auto)
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;           // Assignee user ID (optional)
  createdBy: string;             // Creator user ID (required)
  maxScore?: number;             // Maximum score (optional)
  attachments?: string[];        // File attachments (optional)
}
```

## Key Patterns & Conventions

### 1. Dependency Injection Pattern
The controller receives service instance via constructor:
```typescript
const assignmentService = new AssignmentService();
const assignmentController = new AssignmentController(assignmentService);
```

### 2. Arrow Functions for Controller Methods
All controller methods use arrow functions to preserve `this` context:
```typescript
createAssignment = (req: Request, res: Response): void => { ... }
```

### 3. DTO Pattern
Separate DTOs for create and update operations to enforce type safety:
- `CreateAssignmentDto`: All required fields for creation
- `UpdateAssignmentDto`: All fields optional for partial updates

### 4. Error Handling
Consistent error handling pattern:
```typescript
try {
  // operation
} catch (error) {
  res.status(500).json({
    error: 'Error message',
    message: error instanceof Error ? error.message : 'Unknown error'
  });
}
```

### 5. HTTP Status Codes
- `200`: Success (GET, PUT, POST for updates)
- `201`: Created (POST for new resources)
- `204`: No Content (DELETE)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

### 6. Date Handling
All dates stored as `Date` objects, converted from ISO strings in controller

### 7. Factory Function for Router
Uses factory function pattern: `createAssignmentRouter()`

## Development Workflow

### Setup
```bash
npm install
```

### Development Mode (with auto-reload)
```bash
npm run dev
```
Uses `ts-node` to run TypeScript directly without compilation.

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in `dist/` directory with:
- Source maps
- Declaration files (.d.ts)
- Declaration maps

### Production
```bash
npm start
```
Runs compiled JavaScript from `dist/index.js`

### Testing
```bash
npm test
```
Note: No test files currently exist in the codebase.

## TypeScript Configuration

### Compiler Options (tsconfig.json)
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled (full type safety)
- **Output**: `dist/` directory
- **Source Maps**: Enabled
- **Declaration Files**: Enabled

## API Endpoint Reference

### Base URL
`http://localhost:3000/api/assignments`

### Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| POST | `/` | Create assignment | - |
| GET | `/` | List assignments | status, assignedTo, createdBy |
| GET | `/:id` | Get assignment | - |
| PUT | `/:id` | Update assignment | - |
| DELETE | `/:id` | Delete assignment | - |
| POST | `/update-overdue` | Update overdue | - |

### Query Filtering Examples
- `GET /api/assignments?status=pending`
- `GET /api/assignments?assignedTo=user456`
- `GET /api/assignments?createdBy=user123`

## Guidelines for AI Assistants

### When Reading Code
1. **Always read files before modifying**: Use Read tool first to understand current implementation
2. **Understand the layer**: Identify which layer (Model/Service/Controller/Route) you're working in
3. **Check dependencies**: Read related files to understand data flow

### When Adding Features
1. **Follow the layered architecture**:
   - Models: Add new interfaces/types only
   - Services: Add business logic methods
   - Controllers: Add request handlers
   - Routes: Register new endpoints

2. **Maintain consistency**:
   - Use arrow functions in controllers
   - Follow existing error handling patterns
   - Use DTOs for input validation
   - Keep status codes consistent

3. **Type Safety**:
   - Always define proper TypeScript interfaces
   - Avoid `any` types
   - Use strict null checks

### When Modifying Existing Code
1. **Preserve patterns**: Match existing code style and patterns
2. **Update all layers**: If changing data model, update Service → Controller → Routes
3. **Keep backward compatibility**: Don't break existing API contracts

### When Fixing Bugs
1. **Identify the layer**: Determine if bug is in validation (Controller), logic (Service), or types (Model)
2. **Fix root cause**: Don't add workarounds, fix the actual issue
3. **Test edge cases**: Consider null/undefined, empty arrays, date boundaries

### Common Mistakes to Avoid
1. ❌ **Don't mix concerns**: Keep validation in Controller, logic in Service
2. ❌ **Don't bypass layers**: Controller should call Service, not manipulate data directly
3. ❌ **Don't modify Assignment.ts dates directly**: Let Service set createdAt/updatedAt
4. ❌ **Don't use `as any`**: Fix type issues properly
5. ❌ **Don't forget updatedAt**: Always update timestamp when modifying data

### Code Style Conventions
- **Indentation**: 2 spaces (not tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at end of statements
- **Naming**:
  - Classes: PascalCase (AssignmentService)
  - Methods: camelCase (createAssignment)
  - Interfaces: PascalCase (Assignment)
  - Variables: camelCase
- **Comments**: JSDoc style for public methods

### Testing Considerations
Currently, no test framework is configured. When adding tests:
1. Use Jest (already in devDependencies)
2. Create test files: `*.test.ts` or `*.spec.ts`
3. Test each layer independently
4. Mock dependencies between layers

## Common Development Tasks

### Adding a New Field to Assignment
1. Update `Assignment` interface in `src/models/Assignment.ts`
2. Update `CreateAssignmentDto` if field should be creatable
3. Update `UpdateAssignmentDto` if field should be updatable
4. Update `createAssignment` in `src/services/AssignmentService.ts` to handle new field
5. Update controller validation if needed in `src/controllers/AssignmentController.ts`

### Adding a New Endpoint
1. Add method to `AssignmentService` with business logic
2. Add handler to `AssignmentController` with validation/error handling
3. Register route in `src/routes/assignment.routes.ts`
4. Update README.md with API documentation

### Adding Query Filtering
Example: Filter by date range
1. Add method in Service: `getAssignmentsByDateRange(start, end)`
2. Add handler in Controller: check for query params, call service
3. Controller already handles this in `getAllAssignments` via if-else chain

### Changing Storage Mechanism
Currently uses in-memory Map. To switch to database:
1. Keep Service interface the same (don't change method signatures)
2. Replace Map operations with database queries
3. Make methods async (returns Promise)
4. Update Controller to handle async (add async/await)
5. Add database configuration in `src/index.ts` or separate config file

## Environment Variables

Currently supported:
- `PORT`: HTTP server port (default: 3000)

To add more:
1. Document in README.md
2. Access via `process.env.VARIABLE_NAME`
3. Consider adding `.env.example` file
4. Use a library like `dotenv` for development

## Git Workflow

### Current Branch
Working on: `claude/claude-md-mio8yfi9h0v2jv8e-01Qzxu18qho15oewsnV9wm6W`

### Branch Naming Convention
Feature branches follow pattern: `claude/<description>-<session-id>`

### Commit Messages
Based on git log:
- Use imperative mood: "Add feature" not "Added feature"
- Be specific about what changed
- Example: "Add assignment creation and management service"

### Push Operations
Always use: `git push -u origin <branch-name>`

## Deployment Considerations

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `PORT` environment variable
- [ ] Replace in-memory storage with persistent database
- [ ] Add authentication/authorization
- [ ] Add request validation middleware
- [ ] Add logging (Winston, Morgan)
- [ ] Add rate limiting
- [ ] Enable CORS if needed
- [ ] Add health check monitoring
- [ ] Set up error tracking (Sentry)

### Security Improvements Needed
1. **Input Validation**: Add validation library (joi, zod)
2. **Authentication**: Add JWT or session-based auth
3. **Authorization**: Check user permissions before operations
4. **Rate Limiting**: Prevent abuse
5. **CORS**: Configure allowed origins
6. **Helmet**: Add security headers
7. **SQL Injection**: Not applicable (no SQL), but validate all inputs

## Performance Considerations

### Current Limitations
- In-memory storage: Data lost on restart
- No pagination: Returns all results
- No caching: Every request hits storage
- Synchronous operations: Blocks event loop

### Suggested Improvements
1. Add pagination to `getAllAssignments` (limit, offset)
2. Add database indexes on frequently queried fields
3. Cache frequently accessed assignments
4. Add database connection pooling
5. Consider Redis for session storage

## Additional Resources

- **Express.js Docs**: https://expressjs.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **REST API Best Practices**: https://restfulapi.net/

## Questions or Issues?

When encountering issues:
1. Check TypeScript compilation errors: `npm run build`
2. Verify all dependencies installed: `npm install`
3. Check server logs for runtime errors
4. Verify request format matches API documentation in README.md
5. Test with health check endpoint first: `GET /health`

---

**Last Updated**: 2025-12-02
**Codebase Version**: 1.0.0
**Maintained for**: AI Assistant Context & Human Developer Onboarding
