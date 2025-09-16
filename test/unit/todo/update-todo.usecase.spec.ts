import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTodoUseCase } from '../../../src/modules/todo/application/update-todo.usecase';
import { TODO_REPOSITORY } from '../../../src/modules/todo/domain/todo.repository';
import { Todo, TodoStatus } from '../../../src/modules/todo/domain/todo.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { ITodoRepository } from '../../../src/modules/todo/domain/todo.repository';

describe('UpdateTodoUseCase', () => {
  let useCase: UpdateTodoUseCase;
  let mockTodoRepository: DeepMockProxy<ITodoRepository>;

  beforeEach(async () => {
    mockTodoRepository = UnitTestUtils.createMockTodoRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTodoUseCase,
        {
          provide: TODO_REPOSITORY,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTodoUseCase>(UpdateTodoUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockTodoRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should update todo successfully', async () => {
    const input = {
      id: 'todo-id',
      title: 'Updated Todo',
      description: 'Updated Description',
      status: TodoStatus.IN_PROGRESS,
      ownerId: 'user-id',
    };

    const existingTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      ownerId: 'user-id',
    });
    existingTodo.id = input.id;

    const updatedTodo = Todo.create({
      title: input.title,
      description: input.description,
      status: input.status,
      ownerId: input.ownerId,
    });
    updatedTodo.id = input.id;

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.update.mockResolvedValue(updatedTodo);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findById).toHaveBeenCalledWith(input.id);
    expect(mockTodoRepository.update).toHaveBeenCalledWith(
      input.id,
      expect.any(Object),
    );
    expect(result.todo).toBeDefined();
    expect(result.todo.title).toBe(input.title);
    expect(result.todo.description).toBe(input.description);
    expect(result.todo.status).toBe(input.status);
  });

  it('should update only title', async () => {
    const input = {
      id: 'todo-id',
      title: 'Only Title Updated',
      ownerId: 'user-id',
    };

    const existingTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      ownerId: 'user-id',
    });
    existingTodo.id = input.id;

    const updatedTodo = Todo.create({
      title: input.title,
      description: 'Original Description', // Should remain unchanged
      ownerId: input.ownerId,
    });
    updatedTodo.id = input.id;

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.update.mockResolvedValue(updatedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.title).toBe(input.title);
    expect(result.todo.description).toBe('Original Description');
  });

  it('should update only status', async () => {
    const input = {
      id: 'todo-id',
      status: TodoStatus.DONE,
      ownerId: 'user-id',
    };

    const existingTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      ownerId: 'user-id',
    });
    existingTodo.id = input.id;

    const updatedTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      status: input.status,
      ownerId: input.ownerId,
    });
    updatedTodo.id = input.id;

    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.update.mockResolvedValue(updatedTodo);

    const result = await useCase.execute(input);

    expect(result.todo.status).toBe(TodoStatus.DONE);
    expect(result.todo.title).toBe('Original Todo');
  });

  it('should throw error if todo not found', async () => {
    const input = {
      id: 'nonexistent-id',
      title: 'Updated Todo',
      ownerId: 'user-id',
    };

    mockTodoRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow('Todo not found');
  });

  it('should throw error if user is not the owner', async () => {
    const input = {
      id: 'todo-id',
      title: 'Updated Todo',
      ownerId: 'different-user-id',
    };

    const existingTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      ownerId: 'original-owner-id',
    });
    existingTodo.id = input.id;

    mockTodoRepository.findById.mockResolvedValue(existingTodo);

    await expect(useCase.execute(input)).rejects.toThrow(
      'You can only update your own todos',
    );
  });

  it('should handle empty title update', async () => {
    const input = {
      id: 'todo-id',
      title: '',
      ownerId: 'user-id',
    };

    const existingTodo = Todo.create({
      title: 'Original Todo',
      description: 'Original Description',
      ownerId: 'user-id',
    });
    existingTodo.id = input.id;

    mockTodoRepository.findById.mockResolvedValue(existingTodo);

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
