import { Test, TestingModule } from '@nestjs/testing';
import { ListTodosUseCase } from '../../../src/modules/todo/application/list-todos.usecase';
import { TODO_REPOSITORY } from '../../../src/modules/todo/domain/todo.repository';
import { Todo, TodoStatus } from '../../../src/modules/todo/domain/todo.entity';
import { UserRole } from '../../../src/modules/user/domain/user.entity';
import { UnitTestUtils } from '../test-utils';
import { DeepMockProxy } from 'jest-mock-extended';
import { ITodoRepository } from '../../../src/modules/todo/domain/todo.repository';

describe('ListTodosUseCase', () => {
  let useCase: ListTodosUseCase;
  let mockTodoRepository: DeepMockProxy<ITodoRepository>;

  beforeEach(async () => {
    mockTodoRepository = UnitTestUtils.createMockTodoRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListTodosUseCase,
        {
          provide: TODO_REPOSITORY,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListTodosUseCase>(ListTodosUseCase);
  });

  afterEach(() => {
    UnitTestUtils.resetMocks(mockTodoRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should list user todos successfully', async () => {
    const input = {
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    const todos = [
      Todo.create({
        title: 'Todo 1',
        description: 'Description 1',
        ownerId: input.ownerId,
      }),
      Todo.create({
        title: 'Todo 2',
        description: 'Description 2',
        ownerId: input.ownerId,
        status: TodoStatus.IN_PROGRESS,
      }),
    ];
    todos[0].id = 'todo-1';
    todos[1].id = 'todo-2';

    mockTodoRepository.findByOwnerId.mockResolvedValue(todos);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findByOwnerId).toHaveBeenCalledWith(
      input.ownerId,
    );
    expect(mockTodoRepository.findAll).not.toHaveBeenCalled();
    expect(result.todos).toHaveLength(2);
    expect(result.todos[0].title).toBe('Todo 1');
    expect(result.todos[1].title).toBe('Todo 2');
  });

  it('should list all todos for admin', async () => {
    const input = {
      ownerId: 'admin-id',
      userRole: UserRole.ADMIN,
    };

    const allTodos = [
      Todo.create({
        title: 'User Todo 1',
        description: 'User Description 1',
        ownerId: 'user-1',
      }),
      Todo.create({
        title: 'User Todo 2',
        description: 'User Description 2',
        ownerId: 'user-2',
        status: TodoStatus.DONE,
      }),
      Todo.create({
        title: 'Admin Todo',
        description: 'Admin Description',
        ownerId: input.ownerId,
        status: TodoStatus.IN_PROGRESS,
      }),
    ];
    allTodos[0].id = 'todo-1';
    allTodos[1].id = 'todo-2';
    allTodos[2].id = 'todo-3';

    mockTodoRepository.findAll.mockResolvedValue(allTodos);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findAll).toHaveBeenCalled();
    expect(mockTodoRepository.findByOwnerId).not.toHaveBeenCalled();
    expect(result.todos).toHaveLength(3);
    expect(result.todos[0].title).toBe('User Todo 1');
    expect(result.todos[1].title).toBe('User Todo 2');
    expect(result.todos[2].title).toBe('Admin Todo');
  });

  it('should return empty array when user has no todos', async () => {
    const input = {
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    mockTodoRepository.findByOwnerId.mockResolvedValue([]);

    const result = await useCase.execute(input);

    expect(result.todos).toHaveLength(0);
  });

  it('should return empty array when admin finds no todos', async () => {
    const input = {
      ownerId: 'admin-id',
      userRole: UserRole.ADMIN,
    };

    mockTodoRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute(input);

    expect(result.todos).toHaveLength(0);
  });

  it('should handle repository errors for user', async () => {
    const input = {
      ownerId: 'user-id',
      userRole: UserRole.USER,
    };

    mockTodoRepository.findByOwnerId.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(useCase.execute(input)).rejects.toThrow('Database error');
  });

  it('should handle repository errors for admin', async () => {
    const input = {
      ownerId: 'admin-id',
      userRole: UserRole.ADMIN,
    };

    mockTodoRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(input)).rejects.toThrow('Database error');
  });

  it('should handle empty ownerId', async () => {
    const input = {
      ownerId: '',
      userRole: UserRole.USER,
    };

    mockTodoRepository.findByOwnerId.mockResolvedValue([]);

    const result = await useCase.execute(input);

    expect(mockTodoRepository.findByOwnerId).toHaveBeenCalledWith('');
    expect(result.todos).toHaveLength(0);
  });
});
