import { User, UserRole } from '../../src/modules/user/domain/user.entity';
import { Todo, TodoStatus } from '../../src/modules/todo/domain/todo.entity';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { IUserRepository } from '../../src/modules/user/domain/user.repository';
import { ITodoRepository } from '../../src/modules/todo/domain/todo.repository';
import { JwtService } from '@nestjs/jwt';

/**
 * Unit test utilities for creating mock data
 */
export class UnitTestUtils {
  /**
   * Create a mock user for testing
   */
  static createMockUser(
    overrides: Partial<{
      id: string;
      name: string;
      email: string;
      password: string;
      role: UserRole;
    }> = {},
  ): User {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
      ...overrides,
    };

    const user = User.create(userData);

    // Create a new instance with the specified ID if provided
    if (overrides.id) {
      return new User(
        overrides.id,
        user.name,
        user.email,
        user.password,
        user.role,
      );
    }

    return user;
  }

  /**
   * Create a mock admin user for testing
   */
  static createMockAdmin(
    overrides: Partial<{
      id: string;
      name: string;
      email: string;
      password: string;
    }> = {},
  ): User {
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed-password',
      role: UserRole.ADMIN,
      ...overrides,
    };

    const admin = User.create(adminData);

    // Create a new instance with the specified ID if provided
    if (overrides.id) {
      return new User(
        overrides.id,
        admin.name,
        admin.email,
        admin.password,
        admin.role,
      );
    }

    return admin;
  }

  /**
   * Create a mock todo for testing
   */
  static createMockTodo(
    overrides: Partial<{
      id: string;
      title: string;
      description: string;
      status: TodoStatus;
      ownerId: string;
    }> = {},
  ): Todo {
    const todoData = {
      title: 'Test Todo',
      description: 'Test Description',
      ownerId: 'user-id',
      ...overrides,
    };

    const todo = Todo.create(todoData);

    // Create a new instance with the specified ID if provided
    if (overrides.id) {
      return new Todo(
        overrides.id,
        todo.title,
        todo.description,
        todo.status,
        todo.ownerId,
      );
    }

    return todo;
  }

  /**
   * Create multiple mock todos
   */
  static createMockTodos(
    count: number,
    baseOverrides: Partial<{
      ownerId: string;
      status: TodoStatus;
    }> = {},
  ): Todo[] {
    return Array.from({ length: count }, (_, index) => {
      const todoData = {
        title: `Test Todo ${index + 1}`,
        description: `Test Description ${index + 1}`,
        ownerId: 'user-id',
        ...baseOverrides,
      };

      const todo = Todo.create(todoData);

      // Create a new instance with the specified ID
      return new Todo(
        `todo-${index + 1}`,
        todo.title,
        todo.description,
        todo.status,
        todo.ownerId,
      );
    });
  }

  /**
   * Create a mock user repository with type safety
   */
  static createMockUserRepository(): DeepMockProxy<IUserRepository> {
    return mockDeep<IUserRepository>();
  }

  /**
   * Create a mock todo repository with type safety
   */
  static createMockTodoRepository(): DeepMockProxy<ITodoRepository> {
    return mockDeep<ITodoRepository>();
  }

  /**
   * Create a mock JWT service with type safety
   */
  static createMockJwtService(): DeepMockProxy<JwtService> {
    const mockJwtService = mockDeep<JwtService>();
    mockJwtService.sign.mockReturnValue('mock-jwt-token');
    return mockJwtService;
  }

  /**
   * Reset all mocks to their initial state
   */
  static resetMocks(...mocks: DeepMockProxy<unknown>[]): void {
    mocks.forEach((mock) => {
      mockReset(mock);
    });
  }

  /**
   * Create common test data
   */
  static createTestData() {
    return {
      validUserInput: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      },
      validLoginInput: {
        email: 'john@example.com',
        password: 'Password123!',
      },
      validTodoInput: {
        title: 'Learn NestJS',
        description: 'Complete the NestJS tutorial',
        ownerId: 'user-id',
      },
      validUpdateTodoInput: {
        id: 'todo-id',
        title: 'Updated Todo',
        description: 'Updated Description',
        status: TodoStatus.IN_PROGRESS,
        ownerId: 'user-id',
      },
      validDeleteTodoInput: {
        id: 'todo-id',
        ownerId: 'user-id',
        userRole: UserRole.USER,
      },
      validListTodosInput: {
        ownerId: 'user-id',
        userRole: UserRole.USER,
      },
    };
  }

  /**
   * Create error scenarios for testing
   */
  static createErrorScenarios() {
    return {
      userNotFound: new Error('User not found'),
      todoNotFound: new Error('Todo not found'),
      invalidCredentials: new Error('Invalid credentials'),
      userAlreadyExists: new Error('User with this email already exists'),
      unauthorizedAccess: new Error('You can only update your own todos'),
      unauthorizedDelete: new Error('You can only delete your own todos'),
      databaseError: new Error('Database connection failed'),
    };
  }
}
