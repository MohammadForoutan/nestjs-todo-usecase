import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { BackupService } from './shared/services/backup.service';
import { BackupController } from './shared/controllers/backup.controller';
import { winstonConfig } from './shared/config/winston.config';
import appConfig from './shared/config/app.config';
import databaseConfig from './shared/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUri = configService.get<string>('database.uri');
        const databaseOptions =
          configService.get<MongooseModuleOptions>('database.options') ?? {};
        console.log(databaseUri, databaseOptions);
        return {
          uri: databaseUri,
          useNewUrlParser: true,
          ...databaseOptions,
        };
      },
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('app.jwtSecret') ??
          process.env.JWT_SECRET ??
          'your-secret-key',
        signOptions: {
          expiresIn:
            configService.get<string>('app.jwtExpiresIn') ??
            process.env.JWT_EXPIRES_IN ??
            '24h',
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    WinstonModule.forRoot(winstonConfig),
    UserModule,
    TodoModule,
  ],
  controllers: [AppController, BackupController],
  providers: [AppService, JwtStrategy, BackupService],
  exports: [JwtStrategy],
})
export class AppModule {}
