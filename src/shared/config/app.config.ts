import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
  jwtSecret:
    process.env.JWT_SECRET ?? process.env.APP_JWT_SECRET ?? 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/example',
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL ?? '60000', 10),
  rateLimitLimit: parseInt(process.env.RATE_LIMIT_LIMIT ?? '100', 10),
}));
