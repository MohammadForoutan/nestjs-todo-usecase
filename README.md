# Todo Management System

A complete Todo Management System built with **NestJS + MongoDB + Mongoose + Use-Case-based Architecture**.

## 🚀 Features

- **User Management**: Sign up, login, and profile management
- **Todo Management**: Create, update, delete, and list todos
- **Role-based Access Control**: Admin and regular user roles
- **JWT Authentication**: Secure API endpoints
- **Use-Case Architecture**: Clean separation of concerns
- **MongoDB Integration**: Persistent data storage
- **Docker Support**: Complete containerization with multiple environments
- **Monitoring**: Prometheus and Grafana integration

## 📋 API Endpoints

### User Endpoints

- `POST /users/signup` - Register a new user
- `POST /users/login` - Login user
- `GET /users/profile` - Get user profile (requires auth)

### Todo Endpoints

- `POST /todos` - Create a new todo (requires auth)
- `GET /todos` - List todos (requires auth)
- `PUT /todos/:id` - Update a todo (requires auth)
- `DELETE /todos/:id` - Delete a todo (requires auth)

## 🐳 Docker Setup

The project includes comprehensive Docker support with multiple environments:

### Quick Start with Docker

```bash
# Start development environment
pnpm run docker:dev

# Start production environment
pnpm run docker:prod

# Run tests
pnpm run docker:test

# Start monitoring stack
pnpm run docker:monitoring
```

### Available Docker Commands

| Command                      | Description                   |
| ---------------------------- | ----------------------------- |
| `pnpm run docker:dev`        | Start development environment |
| `pnpm run docker:prod`       | Start production environment  |
| `pnpm run docker:test`       | Run E2E tests                 |
| `pnpm run docker:test-unit`  | Run unit tests                |
| `pnpm run docker:test-ci`    | Run CI tests with coverage    |
| `pnpm run docker:monitoring` | Start monitoring stack        |
| `pnpm run docker:logs`       | View development logs         |
| `pnpm run docker:clean`      | Clean up all containers       |
| `pnpm run docker:stop`       | Stop all environments         |

### Using Makefile

```bash
# View all available commands
make help

# Start development
make dev

# Run tests
make test

# Start monitoring
make monitoring
```

### Docker Environments

- **Development**: Hot reload, persistent data, debug logging
- **Production**: Optimized build, health checks, resource limits
- **Testing**: E2E, unit, and CI test environments
- **Monitoring**: Prometheus + Grafana stack

For detailed Docker documentation, see [docker/README.md](docker/README.md).

## 🏗️ Architecture

```
src/
├── modules/
│   ├── user/
│   │   ├── application/     # Use cases
│   │   ├── domain/         # Entities & Repository interfaces
│   │   ├── infrastructure/ # Mongoose implementations
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   └── todo/
│       ├── application/     # Use cases
│       ├── domain/         # Entities & Repository interfaces
│       ├── infrastructure/ # Mongoose implementations
│       ├── todo.controller.ts
│       ├── todo.service.ts
│       └── todo.module.ts
└── shared/
    ├── guards/             # Authentication & Authorization
    ├── strategies/         # JWT Strategy
    └── utils/             # Shared utilities
```

## 🛠️ Installation

```bash
# Install dependencies
$ pnpm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret

# Start MongoDB (if running locally)
$ mongod

# Run the application
$ pnpm run start:dev
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/example
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

## 📝 Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a todo (with JWT token)

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Learn NestJS",
    "description": "Complete the NestJS tutorial"
  }'
```

## 🧪 Testing

```bash
# Unit tests
$ pnpm run test

# E2E tests
$ pnpm run test:e2e

# Test coverage
$ pnpm run test:cov
```

## 📚 Technologies Used

- **NestJS** - Node.js framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport** - Authentication middleware
- **bcryptjs** - Password hashing
- **class-validator** - Validation
- **class-transformer** - Data transformation

## 🎯 Learning Objectives

This project demonstrates:

- Clean Architecture principles
- Use-Case driven development
- Dependency Injection
- Repository Pattern
- JWT Authentication
- Role-based Authorization
- MongoDB integration
- Data validation
- Error handling
