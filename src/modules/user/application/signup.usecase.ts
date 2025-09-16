import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../domain/user.repository';
import { User, UserRole } from '../domain/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/user.dto';

export type SignUpInput = SignUpDto;

export interface SignUpOutput {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
}

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user
    const user = User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    });

    // Save user
    const savedUser = await this.userRepository.create(user);

    // Generate JWT token
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };
    const accessToken = this.jwtService.sign(payload);

    const userWithoutPassword = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }
}
