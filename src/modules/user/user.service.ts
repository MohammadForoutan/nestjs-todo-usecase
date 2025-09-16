import { Injectable } from '@nestjs/common';
import {
  SignUpUseCase,
  type SignUpInput,
  type SignUpOutput,
} from './application/signup.usecase';
import {
  LoginUseCase,
  type LoginInput,
  type LoginOutput,
} from './application/login.usecase';
import {
  GetProfileUseCase,
  type GetProfileInput,
  type GetProfileOutput,
} from './application/get-profile.usecase';

@Injectable()
export class UserService {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  async signUp(input: SignUpInput): Promise<SignUpOutput> {
    return this.signUpUseCase.execute(input);
  }

  async login(input: LoginInput): Promise<LoginOutput> {
    return this.loginUseCase.execute(input);
  }

  async getProfile(input: GetProfileInput): Promise<GetProfileOutput> {
    return this.getProfileUseCase.execute(input);
  }
}
