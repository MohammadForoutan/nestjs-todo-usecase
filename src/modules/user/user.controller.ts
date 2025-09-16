import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { SignUpOutput } from './application/signup.usecase';
import type { LoginOutput } from './application/login.usecase';
import type { GetProfileOutput } from './application/get-profile.usecase';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators';
import { UserDocs } from './user.docs';
import { SignUpDto, LoginDto } from './application/dtos';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @Version('1')
  @UserDocs.signUp
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignUpOutput> {
    return this.userService.signUp(signUpDto);
  }

  @Post('login')
  @Version('1')
  @UserDocs.login
  async login(@Body() loginDto: LoginDto): Promise<LoginOutput> {
    return this.userService.login(loginDto);
  }

  @Get('profile')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @UserDocs.getProfile
  async getProfile(
    @CurrentUser('sub') userId: string,
  ): Promise<GetProfileOutput> {
    return this.userService.getProfile({ userId });
  }
}
