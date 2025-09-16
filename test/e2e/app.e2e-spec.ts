/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import request from 'supertest';
import helmet from 'helmet';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Set environment variables for testing
    process.env.JWT_SECRET = 'test-jwt-secret-key';
    process.env.NODE_ENV = 'test';
    process.env.APP_JWT_SECRET = 'test-jwt-secret-key';
    process.env.APP_JWT_EXPIRES_IN = '24h';

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(mongoUri), AppModule],
    })
      .overrideProvider('JWT_SECRET')
      .useValue('test-jwt-secret-key')
      .compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    app.use(helmet());
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Authorization',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
          expect(res.body.uptime).toBeDefined();
        });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON', () => {
      return request(app.getHttpServer())
        .post('/users/signup')
        .set('Content-Type', 'application/json')
        .send('{"name":"Test","email":"test@example.com","password":"123"')
        .expect(400);
    });

    it('should handle non-existent endpoints', () => {
      return request(app.getHttpServer())
        .get('/non-existent-endpoint')
        .expect(404);
    });
  });
});
