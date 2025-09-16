import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';
import helmet from 'helmet';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../../src/app.module';
import { createTestHelpers, TestHelpers } from './test-helpers';

export interface TestApp {
  app: INestApplication;
  mongoServer: MongoMemoryServer;
  testHelpers: TestHelpers;
}

/**
 * Setup test application with all necessary configurations
 */
export async function setupTestApp(): Promise<TestApp> {
  // Set environment variables for testing BEFORE creating the app
  process.env.JWT_SECRET = 'test-jwt-secret-key';
  process.env.NODE_ENV = 'test';
  process.env.APP_JWT_SECRET = 'test-jwt-secret-key';
  process.env.APP_JWT_EXPIRES_IN = '24h';

  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [MongooseModule.forRoot(mongoUri), AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Apply the same configuration as main.ts
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.init();
  const testHelpers = createTestHelpers(app);

  return { app, mongoServer, testHelpers };
}

/**
 * Cleanup test application
 */
export async function cleanupTestApp(testApp: TestApp): Promise<void> {
  await testApp.app.close();
  await testApp.mongoServer.stop();
}
