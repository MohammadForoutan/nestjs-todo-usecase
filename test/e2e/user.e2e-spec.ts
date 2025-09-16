/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import {
  setupTestApp,
  cleanupTestApp,
  TestApp,
  TestDataFactory,
} from '../utils';

describe('User Management', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await setupTestApp();
  });

  afterAll(async () => {
    await cleanupTestApp(testApp);
  });

  describe('POST /users/signup', () => {
    it('should create new user', async () => {
      const userData = TestDataFactory.createUserData();

      const response = await request(testApp.app.getHttpServer())
        .post('/users/signup')
        .send(userData)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.role).toBe('user');
      expect(response.body.accessToken).toBeDefined();
    });

    it('should create admin user', async () => {
      const adminData = TestDataFactory.createAdminData();

      const response = await request(testApp.app.getHttpServer())
        .post('/users/signup')
        .send(adminData)
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.name).toBe(adminData.name);
      expect(response.body.user.email).toBe(adminData.email);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.accessToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      const userData = TestDataFactory.createUserData();

      // Create first user
      await request(testApp.app.getHttpServer())
        .post('/users/signup')
        .send(userData)
        .expect(201);

      // Try to create user with same email
      await request(testApp.app.getHttpServer())
        .post('/users/signup')
        .send(userData)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('already exists');
        });
    });

    it('should validate required fields', async () => {
      const invalidData = TestDataFactory.createInvalidUserData();

      await request(testApp.app.getHttpServer())
        .post('/users/signup')
        .send(invalidData)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('POST /users/login', () => {
    it('should login with valid credentials', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      const response = await request(testApp.app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.userData.email,
          password: user.userData.password,
        })
        .expect(201);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(user.userData.email);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      await request(testApp.app.getHttpServer())
        .post('/users/login')
        .send({
          email: user.userData.email,
          password: 'wrong-password',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });
  });

  describe('GET /users/profile', () => {
    it('should get user profile with valid token', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      const response = await request(testApp.app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(user.userData.email);
      expect(response.body.user.name).toBe(user.userData.name);
      expect(response.body.user.role).toBe(user.userData.role);
    });

    it('should reject request without token', async () => {
      await request(testApp.app.getHttpServer())
        .get('/users/profile')
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Unauthorized');
        });
    });

    it('should reject request with invalid token', async () => {
      await request(testApp.app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Unauthorized');
        });
    });
  });
});
