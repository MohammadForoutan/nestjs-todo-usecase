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
import { UserRole } from '../../user/domain/user.entity';

export type DeleteTodoInput = {
  id: string;
  ownerId: string;
  userRole: UserRole;
};

export interface DeleteTodoOutput {
  success: boolean;
}

@Injectable()
export class DeleteTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY) private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(input: DeleteTodoInput): Promise<DeleteTodoOutput> {
    const existingTodo = await this.todoRepository.findById(input.id);
    if (!existingTodo) {
      throw new NotFoundException('Todo not found');
    }

    // Only owner or admin can delete
    if (
      existingTodo.ownerId !== input.ownerId &&
      input.userRole !== UserRole.ADMIN
    ) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    const success = await this.todoRepository.delete(input.id);
    if (!success) {
      throw new NotFoundException('Failed to delete todo');
    }

    return {
      success: true,
    };
  }
}
