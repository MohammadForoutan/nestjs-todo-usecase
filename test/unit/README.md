# Unit Tests

This directory contains comprehensive unit tests for all use cases in the application, following best practices and DRY principles.

## Structure

```text
test/unit/
├── index.ts                           # Main exports
├── test-utils.ts                      # Unit test utilities and helpers
├── user/                              # User module unit tests
│   ├── signup.usecase.spec.ts        # SignUp use case tests
│   ├── login.usecase.spec.ts         # Login use case tests
│   └── get-profile.usecase.spec.ts   # GetProfile use case tests
├── todo/                              # Todo module unit tests
│   ├── create-todo.usecase.spec.ts   # CreateTodo use case tests
│   ├── update-todo.usecase.spec.ts   # UpdateTodo use case tests
│   ├── delete-todo.usecase.spec.ts   # DeleteTodo use case tests
│   └── list-todos.usecase.spec.ts    # ListTodos use case tests
└── README.md                          # This file
```

## Test Coverage

### User Module Use Cases

- ✅ **SignUpUseCase** - User registration with validation
- ✅ **LoginUseCase** - User authentication with credentials
- ✅ **GetProfileUseCase** - User profile retrieval

### Todo Module Use Cases

- ✅ **CreateTodoUseCase** - Todo creation
- ✅ **UpdateTodoUseCase** - Todo updates with ownership validation
- ✅ **DeleteTodoUseCase** - Todo deletion with admin/owner permissions
- ✅ **ListTodosUseCase** - Todo listing with user/admin access control

## Test Utilities

### UnitTestUtils Class

The `UnitTestUtils` class provides reusable utilities for unit testing:

#### Mock Data Creation

- `createMockUser(overrides)` - Create mock user objects
- `createMockAdmin(overrides)` - Create mock admin objects
- `createMockTodo(overrides)` - Create mock todo objects
- `createMockTodos(count, baseOverrides)` - Create multiple mock todos

#### Type-Safe Mock Services

- `createMockUserRepository()` - Type-safe user repository mocks using `DeepMockProxy<IUserRepository>`
- `createMockTodoRepository()` - Type-safe todo repository mocks using `DeepMockProxy<ITodoRepository>`
- `createMockJwtService()` - Type-safe JWT service mocks using `DeepMockProxy<JwtService>`
- `resetMocks(...mocks)` - Reset all mocks to initial state

#### Test Data

- `createTestData()` - Common test input data
- `createErrorScenarios()` - Common error scenarios for testing

## Test Patterns

### 1. Standard Test Structure with Type-Safe Mocks

```typescript
import { DeepMockProxy } from 'jest-mock-extended';
import { IUserRepository } from '../../../src/modules/user/domain/user.repository';

describe('UseCaseName', () => {
  let useCase: UseCaseName;
  let mockRepository: DeepMockProxy<IUserRepository>;

  beforeEach(async () => {
    mockRepository = UnitTestUtils.createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UseCaseName,
        {
          provide: REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<UseCaseName>(UseCaseName);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  // Test cases...
});
```

### 2. Test Categories

#### Happy Path Tests

- Valid input scenarios
- Successful operations
- Expected return values

#### Error Handling Tests

- Invalid input validation
- Repository errors
- Business rule violations
- Authentication/authorization failures

#### Edge Cases

- Empty/null values
- Boundary conditions
- Unusual data formats

#### Security Tests

- Authorization checks
- Ownership validation
- Admin privilege verification

## Test Data Management

### Consistent Test Data

All tests use standardized test data from `UnitTestUtils.createTestData()`:

```typescript
const testData = UnitTestUtils.createTestData();
// testData.validUserInput
// testData.validLoginInput
// testData.validTodoInput
// etc.
```

### Mock Objects

Consistent mock objects ensure reliable testing:

```typescript
const mockUser = UnitTestUtils.createMockUser({
  id: 'user-id',
  email: 'test@example.com',
  role: UserRole.USER,
});
```

## Running Tests

### Run All Unit Tests

```bash
pnpm run test:unit
```

### Run Specific Test File

```bash
pnpm test test/unit/user/signup.usecase.spec.ts
```

### Run with Coverage

```bash
pnpm run test:cov
```

### Watch Mode

```bash
pnpm run test:watch
```

## Test Statistics

- **Total Test Suites**: 7
- **Total Tests**: 47
- **Coverage**: All use cases covered
- **Status**: ✅ All tests passing

## Best Practices

### 1. DRY Principle

- Use `UnitTestUtils` for common operations
- Reuse mock data and test scenarios
- Centralize test patterns

### 2. Clear Test Names

- Descriptive test names that explain the scenario
- Use "should" format: "should create user successfully"
- Include context: "should throw error if user already exists"

### 3. Arrange-Act-Assert Pattern

```typescript
it('should create user successfully', async () => {
  // Arrange
  const input = UnitTestUtils.createTestData().validUserInput;
  const expectedUser = UnitTestUtils.createMockUser();
  mockRepository.create.mockResolvedValue(expectedUser);

  // Act
  const result = await useCase.execute(input);

  // Assert
  expect(result.user).toBeDefined();
  expect(result.user.email).toBe(input.email);
});
```

### 4. Mock Management

- Reset mocks in `beforeEach`
- Use specific mock implementations
- Verify mock calls when important

### 5. Error Testing

- Test both expected and unexpected errors
- Verify error messages
- Test error handling paths

## Benefits Achieved

1. **Complete Coverage** - All use cases have comprehensive unit tests
2. **Type Safety** - Using `jest-mock-extended` for type-safe mocking
3. **Maintainable Code** - DRY principles with reusable utilities
4. **Reliable Testing** - Consistent patterns and mock management
5. **Easy Maintenance** - Centralized utilities and clear documentation
6. **Quality Assurance** - 47 tests covering all critical paths and edge cases

## jest-mock-extended Benefits

### Type Safety

- **Compile-time checking** - TypeScript catches mock method errors at compile time
- **IntelliSense support** - Full autocomplete for mock methods and properties
- **Interface compliance** - Mocks automatically implement the full interface

### Deep Mocking

- **Automatic deep mocking** - Nested objects and methods are automatically mocked
- **No manual setup** - No need to manually define every mock method
- **Consistent behavior** - All mocks behave consistently across tests

### Better Developer Experience

- **Clear error messages** - TypeScript errors are more descriptive
- **Refactoring safety** - Interface changes are caught at compile time
- **Reduced boilerplate** - Less manual mock setup required

## Maintenance

### Adding New Tests

1. Follow the established patterns
2. Use `UnitTestUtils` for mock data
3. Cover happy path, error cases, and edge cases
4. Update this README if adding new test categories

### Updating Tests

1. Keep tests focused on single behaviors
2. Update mock data when business logic changes
3. Maintain test independence
4. Update documentation when patterns change

## Dependencies

- **@nestjs/testing** - NestJS testing utilities
- **jest** - JavaScript testing framework
- **ts-jest** - TypeScript support for Jest
- **jest-mock-extended** - Type-safe mocking utilities
- **bcryptjs** - Password hashing (mocked in tests)
