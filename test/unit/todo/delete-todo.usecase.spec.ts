/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTodoUseCase } from '../../../src/modules/todo/application/delete-todo.usecase';
import { TODO_REPOSITORY } from '../../../src/modules/todo/domain/todo.repository';
import { UserRole } from '../../../src/modules/user/domain/user.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { ITodoRepository } from '../../../src/modules/todo/domain/todo.repository';

describe('DeleteTodoUseCase', () => {
  let useCase: DeleteTodoUseCase;
  let mockTodoRepository: DeepMockProxy<ITodoRepository>;

  beforeEach(async () => {
    mockTodoRepository = UnitTestUtils.createMockTodoRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTodoUseCase,
        {
          provide: TODO_REPOSITORY,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTodoUseCase>(DeleteTodoUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockTodoRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should delete todo successfully by owner', async () => {
    const input = {
      id: 'todo-id',
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    const existingTodo = UnitTestUtils.createMockTodo({
      id: input.id,
      title: 'Test Todo',
      description: 'Test Description',
      ownerId: input.ownerId,
    });

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(input.id);
    expect(mockTodoRepository.delete).toHaveBeenCalledWith(input.id);
    expect(result.success).toBe(true);
  });

  it('should delete todo successfully by admin', async () => {
    const input = {
      id: 'todo-id',
      ownerId: 'different-user-id',
      userRole: UserRole.ADMIN,
    };

    const existingTodo = UnitTestUtils.createMockTodo({
      id: input.id,
      title: 'Test Todo',
      description: 'Test Description',
      ownerId: 'original-owner-id',
    });

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.delete.mockResolvedValue(true);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(input.id);
    expect(mockTodoRepository.delete).toHaveBeenCalledWith(input.id);
    expect(result.success).toBe(true);
  });

  it('should throw error if todo not found', async () => {
    const input = {
      id: 'nonexistent-id',
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    mockTodoRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Todo not found');
  });

  it('should throw error if user is not owner and not admin', async () => {
    const input = {
      id: 'todo-id',
      ownerId: 'different-user-id',
      userRole: UserRole.USER,
    };

    const existingTodo = UnitTestUtils.createMockTodo({
      id: input.id,
      title: 'Test Todo',
      description: 'Test Description',
      ownerId: 'original-owner-id',
    });

    mockTodoRepository.findById.mockResolvedValue(existingTodo);

    await expect(useCase.execute(input)).rejects.toThrow(
      'You can only delete your own todos',
    );
  });

  it('should handle repository delete failure', async () => {
    const input = {
      id: 'todo-id',
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    const existingTodo = UnitTestUtils.createMockTodo({
      id: input.id,
      title: 'Test Todo',
      description: 'Test Description',
      ownerId: input.ownerId,
    });

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.delete.mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toThrow(
      'Failed to delete todo',
    );
  });

  it('should handle empty todo id', async () => {
    const input = {
      id: '',
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    mockTodoRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Todo not found');
  });
});
