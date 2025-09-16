# 🏗️ Architecture Documentation

## Overview

This project follows **Clean Architecture** principles with **Use-Case driven development** approach.

## Architecture Layers

### 1. Domain Layer (`domain/`)

- **Entities**: Core business objects (User, Todo)
- **Repository Interfaces**: Abstract data access contracts
- **Value Objects**: Immutable objects that represent concepts

### 2. Application Layer (`application/`)

- **Use Cases**: Business logic implementation
- **DTOs**: Data Transfer Objects for use case inputs/outputs
- **Interfaces**: Contracts for external dependencies

### 3. Infrastructure Layer (`infrastructure/`)

- **Repository Implementations**: Concrete data access implementations
- **External Services**: Third-party service integrations
- **Database Schemas**: Data persistence models

### 4. Presentation Layer (`controllers/`)

- **Controllers**: HTTP request/response handling
- **DTOs**: Request/response data validation
- **Guards**: Authentication and authorization

## Design Principles

### 1. Dependency Inversion

- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)

### 2. Single Responsibility

- Each class has one reason to change
- Use cases handle single business operations

### 3. Open/Closed Principle

- Open for extension, closed for modification
- New features added through new use cases

### 4. Interface Segregation

- Clients shouldn't depend on interfaces they don't use
- Repository interfaces are specific to their domain

## Module Structure

```
src/modules/{module}/
├── application/          # Use cases and business logic
│   ├── {action}.usecase.ts
│   └── {action}.usecase.spec.ts
├── domain/              # Entities and interfaces
│   ├── {entity}.entity.ts
│   └── {entity}.repository.ts
├── infrastructure/      # External implementations
│   ├── {entity}.schema.ts
│   └── mongoose-{entity}.repository.ts
├── {module}.controller.ts
├── {module}.service.ts
├── {module}.module.ts
└── {module}.docs.ts     # Swagger documentation
```

## Data Flow

1. **Request** → Controller
2. **Controller** → Use Case
3. **Use Case** → Repository (via interface)
4. **Repository** → Database
5. **Response** ← Use Case ← Controller

## Benefits

- **Testability**: Easy to unit test use cases
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to change implementations
- **Scalability**: New features don't affect existing code
