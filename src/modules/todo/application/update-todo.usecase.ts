import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  TODO_REPOSITORY,
  type ITodoRepository,
} from '../domain/todo.repository';
import { Todo } from '../domain/todo.entity';
import { UpdateTodoDto } from './dtos/todo.dto';

export type UpdateTodoInput = UpdateTodoDto & {
  id: string;
  ownerId: string;
};

export interface UpdateTodoOutput {
  todo: Todo;
}

@Injectable()
export class UpdateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(input: UpdateTodoInput): Promise<UpdateTodoOutput> {
    const existingTodo = await this.todoRepository.findById(input.id);
    if (!existingTodo) {
      throw new NotFoundException('Todo not found');
    }

    if (existingTodo.ownerId !== input.ownerId) {
      throw new ForbiddenException('You can only update your own todos');
    }

    let updatedTodo = existingTodo;

    if (input.title !== undefined || input.description !== undefined) {
      updatedTodo = updatedTodo.updateContent(
        input.title ?? updatedTodo.title,
        input.description,
      );
    }

    if (input.status !== undefined) {
      updatedTodo = updatedTodo.updateStatus(input.status);
    }

    const savedTodo = await this.todoRepository.update(input.id, updatedTodo);
    if (!savedTodo) {
      throw new NotFoundException('Failed to update todo');
    }

    return {
      todo: savedTodo,
    };
  }
}
