/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../../src/modules/user/application/login.usecase';
import { USER_REPOSITORY } from '../../../src/modules/user/domain/user.repository';
import { UserRole } from '../../../src/modules/user/domain/user.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { IUserRepository } from '../../../src/modules/user/domain/user.repository';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserRepository: DeepMockProxy<IUserRepository>;
  let mockJwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    mockUserRepository = UnitTestUtils.createMockUserRepository();
    mockJwtService = UnitTestUtils.createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockUserRepository, mockJwtService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should login user successfully with valid credentials', async () => {
    const input = {
      email: 'john@example.com',
      password: 'Password123!',
    };

    const hashedPassword = 'hashed-password';
    const user = UnitTestUtils.createMockUser({
      id: 'user-id',
      name: 'John Doe',
      email: input.email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockedBcrypt.compare.mockResolvedValue(true as never);

    const result = await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      input.password,
      hashedPassword,
    );
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(input.email);
    expect(result.accessToken).toBe('mock-jwt-token');
  });

  it('should throw error if user not found', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'Password123!',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should throw error if password is incorrect', async () => {
    const input = {
      email: 'john@example.com',
      password: 'WrongPassword',
    };

    const user = UnitTestUtils.createMockUser({
      id: 'user-id',
      name: 'John Doe',
      email: input.email,
      password: 'hashed-password',
      role: UserRole.USER,
    });

    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');
  });

  it('should login admin user successfully', async () => {
    const input = {
      email: 'admin@example.com',
      password: 'Admin123!',
    };

    const hashedPassword = 'hashed-admin-password';
    const adminUser = UnitTestUtils.createMockAdmin({
      id: 'admin-id',
      name: 'Admin User',
      email: input.email,
      password: hashedPassword,
    });

    mockUserRepository.findByEmail.mockResolvedValue(adminUser);
    mockedBcrypt.compare.mockResolvedValue(true as never);

    const result = await useCase.execute(input);

    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });
  });
});
