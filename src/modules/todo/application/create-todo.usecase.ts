import { Injectable, Inject } from '@nestjs/common';
import {
  TODO_REPOSITORY,
  type ITodoRepository,
} from '../domain/todo.repository';
import { Todo, TodoStatus } from '../domain/todo.entity';
import { CreateTodoDto } from './dtos/todo.dto';

export type CreateTodoInput = CreateTodoDto & {
  ownerId: string;
};

export interface CreateTodoOutput {
  todo: Todo;
}

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(input: CreateTodoInput): Promise<CreateTodoOutput> {
    const todo = Todo.create({
      title: input.title,
      description: input.description,
      status: TodoStatus.PENDING,
      ownerId: input.ownerId,
    });

    const createdTodo = await this.todoRepository.create(todo);

    return {
      todo: createdTodo,
    };
  }
}
