/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoUseCase } from '../../../src/modules/todo/application/create-todo.usecase';
import { TODO_REPOSITORY } from '../../../src/modules/todo/domain/todo.repository';
import { TodoStatus } from '../../../src/modules/todo/domain/todo.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { ITodoRepository } from '../../../src/modules/todo/domain/todo.repository';

describe('CreateTodoUseCase', () => {
  let useCase: CreateTodoUseCase;
  let mockTodoRepository: DeepMockProxy<ITodoRepository>;

  beforeEach(async () => {
    mockTodoRepository = UnitTestUtils.createMockTodoRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTodoUseCase,
        {
          provide: TODO_REPOSITORY,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTodoUseCase>(CreateTodoUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockTodoRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a new todo successfully', async () => {
    const input = UnitTestUtils.createTestData().validTodoInput;
    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: input.title,
      description: input.description,
      ownerId: input.ownerId,
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.create).toHaveBeenCalled();
    expect(result.todo).toBeDefined();
    expect(result.todo.title).toBe(input.title);
    expect(result.todo.description).toBe(input.description);
    expect(result.todo.status).toBe(TodoStatus.PENDING);
  });

  it('should create todo with default status', async () => {
    const input = {
      title: 'Learn NestJS',
      ownerId: 'user-id',
    };

    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: input.title,
      ownerId: input.ownerId,
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.status).toBe(TodoStatus.PENDING);
  });

  it('should create todo without description', async () => {
    const input = {
      title: 'Simple Todo',
      ownerId: 'user-id',
    };

    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: input.title,
      description: '',
      ownerId: input.ownerId,
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.title).toBe(input.title);
    expect(result.todo.description).toBe('');
  });

  it('should create todo with empty title (no validation)', async () => {
    const input = {
      title: '',
      description: 'Valid description',
      ownerId: 'user-id',
    };

    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: '',
      description: input.description,
      ownerId: input.ownerId,
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.title).toBe('');
    expect(result.todo.description).toBe(input.description);
  });

  it('should create todo with empty ownerId (no validation)', async () => {
    const input = {
      title: 'Valid Title',
      description: 'Valid description',
      ownerId: '',
    };

    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: input.title,
      description: input.description,
      ownerId: '',
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.title).toBe(input.title);
    expect(result.todo.ownerId).toBe('');
  });

  it('should handle repository errors', async () => {
    const input = UnitTestUtils.createTestData().validTodoInput;

    mockTodoRepository.create.mockRejectedValue(
      UnitTestUtils.createErrorScenarios().databaseError,
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      'Database connection failed',
    );
  });

  it('should create todo with very long title (no validation)', async () => {
    const input = {
      title: 'A'.repeat(1000), // Very long title
      description: 'Valid description',
      ownerId: 'user-id',
    };

    const expectedTodo = UnitTestUtils.createMockTodo({
      id: 'generated-id',
      title: input.title,
      description: input.description,
      ownerId: input.ownerId,
    });

    mockTodoRepository.create.mockResolvedValue(expectedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.title).toBe(input.title);
    expect(result.todo.title.length).toBe(1000);
  });
});
