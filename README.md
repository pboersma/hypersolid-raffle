## Description

Hypersolid Raffle is a NestJS-based raffle entry management API. It provides endpoints for creating, reading, and updating raffle entries with email notifications. Built with TypeScript, TypeORM, and SQLite (via better-sqlite3).

## Features

- Raffle entry CRUD operations
- Email notifications on entry creation
- Swagger API documentation at `/api`
- Event-driven architecture with `@nestjs/event-emitter`

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

## API Documentation

Once the application is running, visit `http://localhost:3000/api` for Swagger documentation.

## Run tests

```bash
# unit tests
$ pnpm run test

# test coverage
$ pnpm run test:cov
```