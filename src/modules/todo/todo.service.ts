import { Injectable } from '@nestjs/common';
import {
  CreateTodoUseCase,
  type CreateTodoInput,
  type CreateTodoOutput,
} from './application/create-todo.usecase';
import {
  UpdateTodoUseCase,
  type UpdateTodoInput,
  type UpdateTodoOutput,
} from './application/update-todo.usecase';
import {
  DeleteTodoUseCase,
  type DeleteTodoInput,
  type DeleteTodoOutput,
} from './application/delete-todo.usecase';
import {
  ListTodosUseCase,
  type ListTodosInput,
  type ListTodosOutput,
} from './application/list-todos.usecase';

@Injectable()
export class TodoService {
  constructor(
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    private readonly listTodosUseCase: ListTodosUseCase,
  ) {}

  async createTodo(input: CreateTodoInput): Promise<CreateTodoOutput> {
    return this.createTodoUseCase.execute(input);
  }

  async updateTodo(input: UpdateTodoInput): Promise<UpdateTodoOutput> {
    return this.updateTodoUseCase.execute(input);
  }

  async deleteTodo(input: DeleteTodoInput): Promise<DeleteTodoOutput> {
    return this.deleteTodoUseCase.execute(input);
  }

  async listTodos(input: ListTodosInput): Promise<ListTodosOutput> {
    return this.listTodosUseCase.execute(input);
  }
}
