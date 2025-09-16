import { UserData, TodoData } from './test-helpers';
import { TEST_CONSTANTS } from './test-constants';

export class TestDataFactory {
  /**
   * Generate a unique identifier for testing
   */
  private static generateUniqueId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Generate a unique email for testing
   */
  static generateUniqueEmail(prefix: string): string {
    return `${this.generateUniqueId(prefix)}@example.com`;
  }

  /**
   * Generate test user data
   */
  static createUserData(overrides: Partial<UserData> = {}): UserData {
    return {
      ...TEST_CONSTANTS.DEFAULT_USER,
      email: this.generateUniqueEmail(TEST_CONSTANTS.EMAIL_PREFIXES.USER),
      ...overrides,
    };
  }

  /**
   * Generate test admin data
   */
  static createAdminData(overrides: Partial<UserData> = {}): UserData {
    return {
      ...TEST_CONSTANTS.DEFAULT_ADMIN,
      email: this.generateUniqueEmail(TEST_CONSTANTS.EMAIL_PREFIXES.ADMIN),
      ...overrides,
    };
  }

  /**
   * Generate test todo data
   */
  static createTodoData(overrides: Partial<TodoData> = {}): TodoData {
    return {
      ...TEST_CONSTANTS.DEFAULT_TODO,
      ...overrides,
    };
  }

  /**
   * Generate multiple todo data
   */
  static createMultipleTodoData(
    count: number,
    baseData: Partial<TodoData> = {},
  ): TodoData[] {
    return Array.from({ length: count }, (_, index) => ({
      title: `Test Todo ${index + 1}`,
      description: `Test Description ${index + 1}`,
      ...baseData,
    }));
  }

  /**
   * Generate invalid user data for validation tests
   */
  static createInvalidUserData() {
    return { ...TEST_CONSTANTS.INVALID_USER };
  }

  /**
   * Generate invalid todo data for validation tests
   */
  static createInvalidTodoData() {
    return { ...TEST_CONSTANTS.INVALID_TODO };
  }

  /**
   * Generate fake ObjectId for testing 404 scenarios
   */
  static createFakeObjectId(): string {
    return TEST_CONSTANTS.FAKE_OBJECT_ID;
  }
}
