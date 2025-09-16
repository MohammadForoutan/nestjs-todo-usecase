import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoSchema, TODO_SCHEMA_NAME } from './infrastructure/todo.schema';
import { MongooseTodoRepository } from './infrastructure/mongoose-todo.repository';
import { TODO_REPOSITORY } from './domain/todo.repository';
import { CreateTodoUseCase } from './application/create-todo.usecase';
import { UpdateTodoUseCase } from './application/update-todo.usecase';
import { DeleteTodoUseCase } from './application/delete-todo.usecase';
import { ListTodosUseCase } from './application/list-todos.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TODO_SCHEMA_NAME, schema: TodoSchema }]),
  ],
  controllers: [TodoController],
  providers: [
    TodoService,
    CreateTodoUseCase,
    UpdateTodoUseCase,
    DeleteTodoUseCase,
    ListTodosUseCase,
    {
      provide: TODO_REPOSITORY,
      useClass: MongooseTodoRepository,
    },
  ],
  exports: [TodoService, TODO_REPOSITORY],
})
export class TodoModule {}
