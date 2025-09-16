import { Todo } from './todo.entity';

export interface ITodoRepository {
  create(todo: Todo): Promise<Todo>;
  findById(id: string): Promise<Todo | null>;
  findByOwnerId(ownerId: string): Promise<Todo[]>;
  findAll(): Promise<Todo[]>;
  update(id: string, todo: Partial<Todo>): Promise<Todo | null>;
  delete(id: string): Promise<boolean>;
}

export const TODO_REPOSITORY = 'ITodoRepository';
