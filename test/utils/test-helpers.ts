import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestDataFactory } from './test-data-factory';
import { TEST_CONSTANTS } from './test-constants';

export interface UserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface TodoData {
  title: string;
  description?: string;
}

export interface TestUser {
  userData: UserData;
  token: string;
}

export class TestHelpers {
  constructor(private app: INestApplication) {}

  /**
   * Generate a unique email for testing
   */
  generateUniqueEmail(prefix: string): string {
    return TestDataFactory.generateUniqueEmail(prefix);
  }

  /**
   * Create a user and return the user data and token
   */
  async createUser(userData: UserData): Promise<TestUser> {
    await request(this.app.getHttpServer())
      .post('/users/signup')
      .send(userData);

    const loginResponse = await request(this.app.getHttpServer())
      .post('/users/login')
      .send({
        email: userData.email,
        password: userData.password,
      });

    return {
      userData,
      token: loginResponse.body.accessToken,
    };
  }

  /**
   * Create a todo and return the todo data
   */
  async createTodo(token: string, todoData: TodoData) {
    const response = await request(this.app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    return response.body.todo;
  }

  /**
   * Create multiple todos for a user
   */
  async createMultipleTodos(
    token: string,
    todosData: TodoData[],
  ): Promise<any[]> {
    const todos: any[] = [];
    for (const todoData of todosData) {
      const todo = await this.createTodo(token, todoData);
      todos.push(todo);
    }
    return todos;
  }

  /**
   * Create a user with todos
   */
  async createUserWithTodos(
    userData: UserData,
    todosData: TodoData[],
  ): Promise<{ user: TestUser; todos: any[] }> {
    const user = await this.createUser(userData);
    const todos = await this.createMultipleTodos(user.token, todosData);
    return { user, todos };
  }

  /**
   * Create a regular user with default data
   */
  async createRegularUser(prefix = 'user'): Promise<TestUser> {
    const userData = TestDataFactory.createUserData({
      email: this.generateUniqueEmail(prefix),
    });
    return this.createUser(userData);
  }

  /**
   * Create an admin user with default data
   */
  async createAdminUser(prefix = 'admin'): Promise<TestUser> {
    const userData = TestDataFactory.createAdminData({
      email: this.generateUniqueEmail(prefix),
    });
    return this.createUser(userData);
  }

  /**
   * Create two users for testing cross-user operations
   */
  async createTwoUsers(): Promise<{ user1: TestUser; user2: TestUser }> {
    const [user1, user2] = await Promise.all([
      this.createRegularUser(TEST_CONSTANTS.EMAIL_PREFIXES.USER1),
      this.createRegularUser(TEST_CONSTANTS.EMAIL_PREFIXES.USER2),
    ]);
    return { user1, user2 };
  }

  /**
   * Create a user and admin for testing admin operations
   */
  async createUserAndAdmin(): Promise<{ user: TestUser; admin: TestUser }> {
    const [user, admin] = await Promise.all([
      this.createRegularUser(TEST_CONSTANTS.EMAIL_PREFIXES.USER),
      this.createAdminUser(TEST_CONSTANTS.EMAIL_PREFIXES.ADMIN),
    ]);
    return { user, admin };
  }

  /**
   * Make authenticated request
   */
  async makeAuthenticatedRequest(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    token: string,
    data?: any,
  ): Promise<any> {
    let req = request(this.app.getHttpServer())[method](url);
    req = req.set('Authorization', `Bearer ${token}`);
    if (data) {
      req = req.send(data);
    }
    return req;
  }

  /**
   * Clean up all users and todos (for cleanup between tests if needed)
   */
  cleanup() {
    // This would require implementing cleanup endpoints or direct database access
    // For now, we rely on fresh data for each test
    console.log('Cleanup: Using fresh data for each test');
  }
}

/**
 * Factory function to create test helpers
 */
export const createTestHelpers = (app: INestApplication) =>
  new TestHelpers(app);
