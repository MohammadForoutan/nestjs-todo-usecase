import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema, USER_SCHEMA_NAME } from './infrastructure/user.schema';
import { MongooseUserRepository } from './infrastructure/mongoose-user.repository';
import { USER_REPOSITORY } from './domain/user.repository';
import { SignUpUseCase } from './application/signup.usecase';
import { LoginUseCase } from './application/login.usecase';
import { GetProfileUseCase } from './application/get-profile.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_SCHEMA_NAME, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    SignUpUseCase,
    LoginUseCase,
    GetProfileUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserService, USER_REPOSITORY],
})
export class UserModule {}
