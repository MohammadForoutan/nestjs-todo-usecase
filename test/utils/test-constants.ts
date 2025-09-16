/**
 * Shared constants for test utilities
 */
export const TEST_CONSTANTS = {
  // Default user data
  DEFAULT_USER: {
    name: 'Test User',
    password: 'Password123!',
    role: 'user' as const,
  },

  DEFAULT_ADMIN: {
    name: 'Admin User',
    password: 'Admin123!',
    role: 'admin' as const,
  },

  // Default todo data
  DEFAULT_TODO: {
    title: 'Test Todo',
    description: 'Test Description',
  },

  // Invalid data for validation tests
  INVALID_USER: {
    name: '', // Empty name
    email: 'invalid-email', // Invalid email
    password: '123', // Too short password
  },

  INVALID_TODO: {
    title: '', // Empty title
    description: 'Valid description but no title',
  },

  // Fake ObjectId for 404 testing
  FAKE_OBJECT_ID: '507f1f77bcf86cd799439011',

  // Email prefixes
  EMAIL_PREFIXES: {
    USER: 'user',
    ADMIN: 'admin',
    USER1: 'user1',
    USER2: 'user2',
  },
} as const;
