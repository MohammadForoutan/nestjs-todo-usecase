import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import type {
  CreateTodoInput,
  CreateTodoOutput,
} from './application/create-todo.usecase';
import type {
  UpdateTodoInput,
  UpdateTodoOutput,
} from './application/update-todo.usecase';
import type {
  DeleteTodoInput,
  DeleteTodoOutput,
} from './application/delete-todo.usecase';
import type {
  ListTodosInput,
  ListTodosOutput,
} from './application/list-todos.usecase';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../shared/decorators';
import { TodoDocs } from './todo.docs';
import { UserRole } from '../user/domain/user.entity';
import { CreateTodoDto, UpdateTodoDto } from './application/dtos';

@ApiTags('Todos')
@Controller({
  path: 'todos',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @Version('1')
  @TodoDocs.create
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<CreateTodoOutput> {
    const input: CreateTodoInput = {
      title: createTodoDto.title,
      description: createTodoDto.description,
      ownerId,
    };
    return this.todoService.createTodo(input);
  }

  @Put(':id')
  @Version('1')
  @TodoDocs.update
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @CurrentUser('sub') ownerId: string,
  ): Promise<UpdateTodoOutput> {
    const input: UpdateTodoInput = {
      id,
      title: updateTodoDto.title,
      description: updateTodoDto.description,
      status: updateTodoDto.status,
      ownerId,
    };
    return this.todoService.updateTodo(input);
  }

  @Delete(':id')
  @ApiTags()
  @Version('2')
  @TodoDocs.delete
  async deleteTodo(
    @Param('id') id: string,
    @CurrentUser('sub') ownerId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<DeleteTodoOutput> {
    const input: DeleteTodoInput = {
      id,
      ownerId,
      userRole,
    };
    return this.todoService.deleteTodo(input);
  }

  @Get()
  @Version('1')
  @TodoDocs.list
  async listTodos(
    @CurrentUser('sub') ownerId: string,
    @CurrentUser('role') userRole: UserRole,
  ): Promise<ListTodosOutput> {
    const input: ListTodosInput = {
      ownerId,
      userRole,
    };
    return this.todoService.listTodos(input);
  }
}
