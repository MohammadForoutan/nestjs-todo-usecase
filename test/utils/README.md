# Test Utilities

This directory contains reusable utilities for E2E testing that follow DRY principles and ensure fresh data for each test case.

## Structure

```
test/utils/
├── index.ts                 # Main exports
├── test-helpers.ts          # Core test helper functions
├── test-data-factory.ts     # Test data generation
├── test-setup.ts           # Shared test application setup
├── test-constants.ts       # Shared constants and default values
└── README.md               # This file
```

## Key Features

### 1. DRY Principle

- **No repeated code**: Common operations like user creation, authentication, and data setup are centralized
- **Reusable helpers**: Functions can be used across different test files
- **Consistent patterns**: All tests follow the same structure and patterns
- **Shared constants**: Default values and configurations are centralized in `test-constants.ts`
- **Eliminated duplications**: Email generation, default data, and validation data are shared between utilities

### 2. Fresh Data for Each Test

- **Unique identifiers**: Each test generates unique emails and data
- **Isolated tests**: No test depends on data from other tests
- **Clean state**: Each test starts with a fresh database state

### 3. Comprehensive Helper Functions

#### TestHelpers Class

- `createUser(userData)` - Create a user and return token
- `createRegularUser(prefix)` - Create a regular user with default data
- `createAdminUser(prefix)` - Create an admin user with default data
- `createTwoUsers()` - Create two users for cross-user testing
- `createUserAndAdmin()` - Create a user and admin for admin testing
- `createTodo(token, todoData)` - Create a todo for a user
- `createMultipleTodos(token, todosData)` - Create multiple todos
- `createUserWithTodos(userData, todosData)` - Create user with todos
- `generateUniqueEmail(prefix)` - Generate unique email addresses

#### TestDataFactory Class

- `createUserData(overrides)` - Generate user test data
- `createAdminData(overrides)` - Generate admin test data
- `createTodoData(overrides)` - Generate todo test data
- `createMultipleTodoData(count, baseData)` - Generate multiple todo data
- `createInvalidUserData()` - Generate invalid user data for validation tests
- `createInvalidTodoData()` - Generate invalid todo data for validation tests
- `createFakeObjectId()` - Generate fake ObjectId for 404 testing

#### Test Setup

- `setupTestApp()` - Setup complete test application with all configurations
- `cleanupTestApp(testApp)` - Cleanup test application and resources

#### Test Constants

- `TEST_CONSTANTS` - Centralized constants for default values, invalid data, and email prefixes
- `DEFAULT_USER` - Default user data constants
- `DEFAULT_ADMIN` - Default admin data constants
- `DEFAULT_TODO` - Default todo data constants
- `INVALID_USER` - Invalid user data for validation tests
- `INVALID_TODO` - Invalid todo data for validation tests
- `FAKE_OBJECT_ID` - Fake ObjectId for 404 testing
- `EMAIL_PREFIXES` - Standardized email prefixes for different user types

## Usage Examples

### Basic Test Structure

```typescript
import { setupTestApp, cleanupTestApp, TestApp } from '../utils';

describe('Feature Tests', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await setupTestApp();
  });

  afterAll(async () => {
    await cleanupTestApp(testApp);
  });

  it('should do something', async () => {
    // Create fresh data for this test
    const user = await testApp.testHelpers.createRegularUser();

    // Test implementation
    const response = await request(testApp.app.getHttpServer()).post('/endpoint').set('Authorization', `Bearer ${user.token}`).send(data);

    expect(response.status).toBe(201);
  });
});
```

### Creating Test Data

```typescript
// Create a user with todos
const { user, todos } = await testApp.testHelpers.createUserWithTodos({ name: 'Test User', email: 'test@example.com', password: 'Password123!' }, [
  { title: 'Todo 1', description: 'First todo' },
  { title: 'Todo 2', description: 'Second todo' },
]);

// Create two users for cross-user testing
const { user1, user2 } = await testApp.testHelpers.createTwoUsers();

// Create user and admin for admin testing
const { user, admin } = await testApp.testHelpers.createUserAndAdmin();
```

### Using Test Data Factory

```typescript
import { TestDataFactory } from '../utils';

// Generate test data
const userData = TestDataFactory.createUserData({
  name: 'Custom User',
  email: 'custom@example.com',
});

const todoData = TestDataFactory.createTodoData({
  title: 'Custom Todo',
  description: 'Custom Description',
});

// Generate invalid data for validation tests
const invalidData = TestDataFactory.createInvalidUserData();
```

## Benefits

1. **Maintainability**: Changes to test patterns only need to be made in one place
2. **Readability**: Tests are more focused on the actual test logic rather than setup
3. **Reliability**: Fresh data ensures tests don't interfere with each other
4. **Scalability**: Easy to add new test patterns and utilities
5. **Consistency**: All tests follow the same patterns and conventions
6. **No Duplications**: Shared constants and utilities eliminate code duplication
7. **Centralized Configuration**: All default values and constants are in one place
8. **Type Safety**: Shared interfaces ensure consistent data structures across utilities

## Best Practices

1. **Always use fresh data**: Don't rely on data from other tests
2. **Use descriptive prefixes**: When generating unique data, use meaningful prefixes
3. **Group related tests**: Use describe blocks to group related test cases
4. **Clean up resources**: Always call cleanup functions in afterAll
5. **Use helper functions**: Don't repeat common operations, use the provided helpers
