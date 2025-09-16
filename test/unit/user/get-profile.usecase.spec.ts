import { Test, TestingModule } from '@nestjs/testing';
import { GetProfileUseCase } from '../../../src/modules/user/application/get-profile.usecase';
import { USER_REPOSITORY } from '../../../src/modules/user/domain/user.repository';
import { UserRole } from '../../../src/modules/user/domain/user.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { IUserRepository } from '../../../src/modules/user/domain/user.repository';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;
  let mockUserRepository: DeepMockProxy<IUserRepository>;

  beforeEach(async () => {
    mockUserRepository = UnitTestUtils.createMockUserRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProfileUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProfileUseCase>(GetProfileUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockUserRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should get user profile successfully', async () => {
    const input = {
      userId: 'user-id',
    };

    const user = UnitTestUtils.createMockUser({
      id: input.userId,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
    });

    mockUserRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.findById).toHaveBeenCalledWith(input.userId);
    expect(result.user).toBeDefined();
    expect(result.user.id).toBe(input.userId);
    expect(result.user.name).toBe('John Doe');
    expect(result.user.email).toBe('john@example.com');
    expect(result.user.role).toBe(UserRole.USER);
  });

  it('should get admin profile successfully', async () => {
    const input = {
      userId: 'admin-id',
    };

    const adminUser = UnitTestUtils.createMockAdmin({
      id: input.userId,
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashed-password',
    });

    mockUserRepository.findById.mockResolvedValue(adminUser);

    const result = await useCase.execute(input);

    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(result.user.name).toBe('Admin User');
    expect(result.user.email).toBe('admin@example.com');
  });

  it('should throw error if user not found', async () => {
    const input = {
      userId: 'nonexistent-id',
    };

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });

  it('should handle empty userId', async () => {
    const input = {
      userId: '',
    };

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('User not found');
  });
});
