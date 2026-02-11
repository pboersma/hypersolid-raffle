## Description

HyperSolid Raffle is a NestJS-based raffle management API. It provides endpoints for managing raffle entries, executing draws, and tracking results with email notifications. Built with TypeScript, TypeORM, and SQLite (via better-sqlite3).

## Features

- **Raffle Entry Management**: Full CRUD operations for raffle entries (create, read, update, delete)
- **Automated Raffle Draws**: Weekly automated draws (Mondays at 1 PM) with time-window selection
- **Manual Draw Trigger**: Force draw execution via API endpoint without waiting for scheduled time
- **Email Notifications**: Automated emails for entry confirmation, winner announcement, and non-winner notifications
- **Raffle Result History**: Persistent storage of all draw results with winner details
- **Event-Driven Architecture**: Decoupled event system using `@nestjs/event-emitter` for side effects
- **Swagger API Documentation**: Interactive API docs at `/api` with custom decorators
- **Comprehensive Testing**: Unit tests for all modules with organized test structure

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run with Docker

```bash
# Build and start the container
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000` with hot reload enabled.

## Architecture & Design Patterns

This application follows several architectural patterns for maintainability and scalability:

### Repository Pattern
Custom providers abstract database access (e.g., `RAFFLE_ENTRY_REPOSITORY`), separating data access from business logic. Located in `src/database/`.

### Dependency Injection
NestJS's DI container manages all service dependencies through constructor injection, enabling loose coupling and testability.

### Event-Driven Architecture
Uses `@nestjs/event-emitter` for decoupled communication between modules:
- `RaffleEntryCreatedEvent` - Triggered when a new entry is created
- `WinnerSelectedEvent` / `NonWinnersSelectedEvent` - Triggered during raffle draw
- `RaffleDrawExecutedEvent` - Triggered when draw completes

Listeners in `src/raffle-draw/listeners/` handle side effects (emails, persistence) independently.

### Module Pattern
Feature-based organization with clear boundaries:
- `raffle-entry/` - Entry CRUD operations
- `raffle-draw/` - Draw execution and event handling
- `raffle-result/` - Result persistence and queries

### Data Transfer Object (DTO)
Request/response validation using `class-validator` decorators on DTO classes in `src/**/dto/`.

### Decorator Pattern
Custom Swagger decorators (`src/common/decorators/`) encapsulate OpenAPI metadata, keeping controllers clean and readable.

### Cron/Scheduler Pattern
Weekly automated draws using `@nestjs/schedule` with manual override capability via `POST /raffle-draw`.

### Separation of Concerns
- Controllers: HTTP handling only
- Services: Business logic
- Listeners: Side effects (emails, logging)
- Entities: Data models
- Decorators: Reusable metadata

## API Endpoints

### Raffle Entry (`/raffle-entry`)
- `GET /raffle-entry` - List all entries
- `GET /raffle-entry/:id` - Get entry by ID
- `POST /raffle-entry` - Create new entry
- `PUT /raffle-entry/:id` - Update entry
- `DELETE /raffle-entry/:id` - Delete entry

### Raffle Draw (`/raffle-draw`)
- `POST /raffle-draw` - Execute forced draw immediately

### Raffle Result (`/raffle-result`)
- `GET /raffle-result` - List all draw results
- `GET /raffle-result/latest` - Get most recent result

## API Documentation

Once the application is running, visit `http://localhost:3000/api` for interactive Swagger documentation.

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```