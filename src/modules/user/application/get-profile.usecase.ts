import { Injectable, Inject } from '@nestjs/common';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../domain/user.repository';
import type { User } from '../domain/user.entity';

export type GetProfileInput = {
  userId: string;
};

export interface GetProfileOutput {
  user: User;
}

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetProfileInput): Promise<GetProfileOutput> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user,
    };
  }
}
