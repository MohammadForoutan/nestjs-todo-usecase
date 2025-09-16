# 🤝 Contributing Guidelines

## Getting Started

### Prerequisites

- Node.js 20.11.1 (managed by Volta)
- pnpm 9.12.0 (managed by Volta)
- MongoDB 7.0+
- Git

### Setup Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd example
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**

   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   pnpm run start:dev
   ```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the existing code structure
- Write tests for new features
- Update documentation if needed

### 3. Run Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# All tests
pnpm run test:cov
```

### 4. Code Quality

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Check formatting
pnpm run format:check
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

## Code Standards

### TypeScript

- Use strict mode
- Prefer `interface` over `type` for object shapes
- Use `const` assertions where appropriate
- Avoid `any` type

### NestJS

- Follow dependency injection patterns
- Use decorators appropriately
- Implement proper error handling
- Use guards for authentication/authorization

### Architecture

- Follow Clean Architecture principles
- Keep use cases focused and single-purpose
- Use repository pattern for data access
- Implement proper separation of concerns

### Testing

- Write unit tests for use cases
- Write integration tests for controllers
- Write E2E tests for complete flows
- Aim for 80%+ code coverage

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat(auth): add JWT token refresh
fix(todo): handle empty title validation
docs(api): update authentication guide
test(user): add signup use case tests
```

## Pull Request Process

### 1. Before Submitting

- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] Code is properly formatted
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] No commented code

### 2. PR Description

- Clear description of changes
- Link to related issues
- Screenshots for UI changes
- Breaking changes noted

### 3. Review Process

- At least one approval required
- Address all review comments
- Keep PR focused and small
- Update PR if new commits added

## Testing Guidelines

### Unit Tests

- Test business logic in use cases
- Mock external dependencies
- Test both success and error cases
- Use descriptive test names

### Integration Tests

- Test controller endpoints
- Use test database
- Test authentication flows
- Test validation rules

### E2E Tests

- Test complete user workflows
- Use real HTTP requests
- Test error scenarios
- Clean up test data

## Documentation

### Code Documentation

- Use JSDoc for public APIs
- Document complex business logic
- Include examples where helpful
- Keep comments up to date

### API Documentation

- Update Swagger annotations
- Provide request/response examples
- Document error cases
- Include authentication requirements

### README Updates

- Update setup instructions
- Add new environment variables
- Document new features
- Update API examples

## Performance Guidelines

### Database

- Use appropriate indexes
- Avoid N+1 queries
- Use pagination for large datasets
- Optimize aggregation queries

### API

- Implement proper caching
- Use compression
- Minimize response payload
- Implement rate limiting

### Code

- Avoid unnecessary loops
- Use efficient algorithms
- Minimize memory usage
- Profile performance-critical code

## Security Guidelines

### Input Validation

- Validate all inputs
- Sanitize user data
- Use appropriate data types
- Implement length limits

### Authentication

- Use secure JWT secrets
- Implement proper token expiration
- Validate tokens on every request
- Use HTTPS in production

### Data Protection

- Hash passwords properly
- Don't log sensitive data
- Use environment variables for secrets
- Implement proper error handling

## Troubleshooting

### Common Issues

1. **Port already in use**: Change PORT in .env
2. **MongoDB connection failed**: Check MongoDB is running
3. **JWT token invalid**: Check JWT_SECRET in .env
4. **Tests failing**: Check test database connection

### Getting Help

- Check existing issues
- Search documentation
- Ask in team chat
- Create new issue if needed

## Release Process

### Version Bumping

- Use semantic versioning
- Update package.json version
- Update CHANGELOG.md
- Tag release in Git

### Deployment

- Run full test suite
- Build production version
- Deploy to staging first
- Monitor after deployment
