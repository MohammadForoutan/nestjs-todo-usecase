/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { SignUpUseCase } from '../../../src/modules/user/application/signup.usecase';
import { USER_REPOSITORY } from '../../../src/modules/user/domain/user.repository';
import { UserRole } from '../../../src/modules/user/domain/user.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { IUserRepository } from '../../../src/modules/user/domain/user.repository';

describe('SignUpUseCase', () => {
  let useCase: SignUpUseCase;
  let mockUserRepository: DeepMockProxy<IUserRepository>;
  let mockJwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    mockUserRepository = UnitTestUtils.createMockUserRepository();
    mockJwtService = UnitTestUtils.createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignUpUseCase,
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

    useCase = module.get<SignUpUseCase>(SignUpUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockUserRepository, mockJwtService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new user successfully', async () => {
    const input = UnitTestUtils.createTestData().validUserInput;
    const expectedUser = UnitTestUtils.createMockUser({
      id: 'generated-id',
      email: input.email,
      name: input.name,
    });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(expectedUser);

    const result = await useCase.execute(input);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(input.email);
    expect(result.accessToken).toBe('mock-jwt-token');
  });

  it('should create admin user successfully', async () => {
    const input = {
      ...UnitTestUtils.createTestData().validUserInput,
      role: UserRole.ADMIN,
    };
    const expectedUser = UnitTestUtils.createMockAdmin({
      id: 'admin-id',
      email: input.email,
      name: input.name,
    });

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(expectedUser);

    const result = await useCase.execute(input);

    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: expectedUser.id,
      email: expectedUser.email,
      role: expectedUser.role,
    });
  });

  it('should throw error if user already exists', async () => {
    const input = UnitTestUtils.createTestData().validUserInput;
    const existingUser = UnitTestUtils.createMockUser({
      id: 'existing-id',
      email: input.email,
    });

    mockUserRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(input)).rejects.toThrow(
      'User with this email already exists',
    );
  });

  it('should handle empty email', async () => {
    const input = {
      ...UnitTestUtils.createTestData().validUserInput,
      email: '',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow();
  });

  it('should handle empty password', async () => {
    const input = {
      ...UnitTestUtils.createTestData().validUserInput,
      password: '',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow();
  });

  it('should handle repository errors', async () => {
    const input = UnitTestUtils.createTestData().validUserInput;

    mockUserRepository.findByEmail.mockRejectedValue(
      UnitTestUtils.createErrorScenarios().databaseError,
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      'Database connection failed',
    );
  });
});
