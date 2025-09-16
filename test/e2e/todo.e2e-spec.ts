/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from 'supertest';
import { setupTestApp, cleanupTestApp, TestApp } from '../utils';

describe('Todo Management', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await setupTestApp();
  });

  afterAll(async () => {
    await cleanupTestApp(testApp);
  });

  describe('POST /todos', () => {
    it('should require authentication', () => {
      return request(testApp.app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(401);
    });

    it('should create todo with valid token', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        })
        .expect(201);

      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe('Test Todo');
      expect(response.body.todo.description).toBe('Test Description');
      expect(response.body.todo.status).toBe('pending');
      expect(response.body.todo.ownerId).toBeDefined();
    });

    it('should create todo without description', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      const response = await request(testApp.app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Simple Todo',
        })
        .expect(201);

      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe('Simple Todo');
      expect(response.body.todo.description).toBe('');
      expect(response.body.todo.status).toBe('pending');
    });

    it('should validate required fields', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();

      return request(testApp.app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          description: 'Test Description',
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeDefined();
        });
    });
  });

  describe('GET /todos', () => {
    it('should require authentication', () => {
      return request(testApp.app.getHttpServer()).get('/todos').expect(401);
    });

    it('should list user todos', async () => {
      // Create fresh user with todos for this test
      const user = await testApp.testHelpers.createRegularUser();
      await testApp.testHelpers.createMultipleTodos(user.token, [
        { title: 'Todo 1', description: 'First todo' },
        { title: 'Todo 2', description: 'Second todo' },
      ]);

      const response = await request(testApp.app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.todos).toBeDefined();
      expect(Array.isArray(response.body.todos)).toBe(true);
      expect(response.body.todos).toHaveLength(2);
    });

    it('should allow admin to see all todos', async () => {
      // Create fresh users for this test
      const { user, admin } = await testApp.testHelpers.createUserAndAdmin();

      // Create todos for both users
      await testApp.testHelpers.createTodo(user.token, {
        title: 'User Todo 1',
      });
      await testApp.testHelpers.createTodo(user.token, {
        title: 'User Todo 2',
      });
      await testApp.testHelpers.createTodo(admin.token, {
        title: 'Admin Todo 1',
      });

      const response = await request(testApp.app.getHttpServer())
        .get('/todos')
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.todos).toBeDefined();
      expect(Array.isArray(response.body.todos)).toBe(true);
      expect(response.body.todos.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should require authentication', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      return request(testApp.app.getHttpServer())
        .put(`/todos/${fakeId}`)
        .send({
          title: 'Updated Todo',
        })
        .expect(401);
    });

    it('should update todo', async () => {
      // Create fresh user and todo for this test
      const user = await testApp.testHelpers.createRegularUser();
      const todo = await testApp.testHelpers.createTodo(user.token, {
        title: 'Original Todo',
        description: 'Original Description',
      });

      const response = await request(testApp.app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Updated Todo',
          description: 'Updated Description',
          status: 'in-progress',
        })
        .expect(200);

      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe('Updated Todo');
      expect(response.body.todo.description).toBe('Updated Description');
      expect(response.body.todo.status).toBe('in-progress');
    });

    it('should update only title', async () => {
      // Create fresh user and todo for this test
      const user = await testApp.testHelpers.createRegularUser();
      const todo = await testApp.testHelpers.createTodo(user.token, {
        title: 'Original Todo',
        description: 'Original Description',
      });

      const response = await request(testApp.app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Only Title Updated',
        })
        .expect(200);

      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe('Only Title Updated');
      expect(response.body.todo.description).toBe('Original Description');
    });

    it('should update only status', async () => {
      // Create fresh user and todo for this test
      const user = await testApp.testHelpers.createRegularUser();
      const todo = await testApp.testHelpers.createTodo(user.token, {
        title: 'Original Todo',
        description: 'Original Description',
      });

      const response = await request(testApp.app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          status: 'done',
        })
        .expect(200);

      expect(response.body.todo).toBeDefined();
      expect(response.body.todo.title).toBe('Original Todo');
      expect(response.body.todo.status).toBe('done');
    });

    it('should reject update of other user todo', async () => {
      // Create fresh users for this test
      const { user1, user2 } = await testApp.testHelpers.createTwoUsers();

      // Create todo for user2
      const todo = await testApp.testHelpers.createTodo(user2.token, {
        title: 'User2 Todo',
        description: 'This belongs to user2',
      });

      return request(testApp.app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .send({
          title: 'Hacked Todo',
        })
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toContain('own todos');
        });
    });

    it('should return 404 for non-existent todo', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();
      const fakeId = '507f1f77bcf86cd799439011';

      return request(testApp.app.getHttpServer())
        .put(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({
          title: 'Updated Todo',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should require authentication', () => {
      const fakeId = '507f1f77bcf86cd799439011';
      return request(testApp.app.getHttpServer())
        .delete(`/todos/${fakeId}`)
        .expect(401);
    });

    it('should delete todo', async () => {
      // Create fresh user and todo for this test
      const user = await testApp.testHelpers.createRegularUser();
      const todo = await testApp.testHelpers.createTodo(user.token, {
        title: 'Todo to Delete',
        description: 'This will be deleted',
      });

      const response = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should reject deletion of other user todo', async () => {
      // Create fresh users for this test
      const { user1, user2 } = await testApp.testHelpers.createTwoUsers();

      // Create todo for user2
      const todo = await testApp.testHelpers.createTodo(user2.token, {
        title: 'User2 Todo',
        description: 'This belongs to user2',
      });

      return request(testApp.app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${user1.token}`)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toContain('own todos');
        });
    });

    it('should allow admin to delete any todo', async () => {
      // Create fresh users for this test
      const { user, admin } = await testApp.testHelpers.createUserAndAdmin();

      // Create todo for regular user
      const todo = await testApp.testHelpers.createTodo(user.token, {
        title: 'User Todo',
        description: 'This belongs to regular user',
      });

      const response = await request(testApp.app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      // Create fresh user for this test
      const user = await testApp.testHelpers.createRegularUser();
      const fakeId = '507f1f77bcf86cd799439011';

      return request(testApp.app.getHttpServer())
        .delete(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('not found');
        });
    });
  });
});
