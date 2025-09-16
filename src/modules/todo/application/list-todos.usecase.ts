import { Injectable, Inject } from '@nestjs/common';
import {
  TODO_REPOSITORY,
  type ITodoRepository,
} from '../domain/todo.repository';
import type { Todo } from '../domain/todo.entity';
import { UserRole } from '../../user/domain/user.entity';

export type ListTodosInput = {
  ownerId: string;
  userRole: UserRole;
};

export interface ListTodosOutput {
  todos: Todo[];
}

@Injectable()
export class ListTodosUseCase {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(input: ListTodosInput): Promise<ListTodosOutput> {
    let todos: Todo[];

    if (input.userRole === UserRole.ADMIN) {
      // Admin can see all todos
      todos = await this.todoRepository.findAll();
    } else {
      // Regular user can only see their own todos
      todos = await this.todoRepository.findByOwnerId(input.ownerId);
    }

    return {
      todos,
    };
  }
}
