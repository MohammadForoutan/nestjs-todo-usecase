import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { ITodoRepository } from '../domain/todo.repository';
import { Todo } from '../domain/todo.entity';
import { TodoDocument, TODO_SCHEMA_NAME } from './todo.schema';

@Injectable()
export class MongooseTodoRepository implements ITodoRepository {
  constructor(
    @InjectModel(TODO_SCHEMA_NAME) private todoModel: Model<TodoDocument>,
  ) {}

  async create(todo: Todo): Promise<Todo> {
    const createdTodo = new this.todoModel({
      title: todo.title,
      description: todo.description,
      status: todo.status,
      ownerId: todo.ownerId,
    });

    const savedTodo = await createdTodo.save();
    return this.toDomain(savedTodo);
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = await this.todoModel.findById(id).exec();
    return todo ? this.toDomain(todo) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Todo[]> {
    const todos = await this.todoModel.find({ ownerId }).exec();
    return todos.map((todo) => this.toDomain(todo));
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoModel.find().exec();
    return todos.map((todo) => this.toDomain(todo));
  }

  async update(id: string, todoData: Partial<Todo>): Promise<Todo | null> {
    const updatedTodo = await this.todoModel
      .findByIdAndUpdate(id, todoData, { new: true })
      .exec();
    return updatedTodo ? this.toDomain(updatedTodo) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.todoModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private toDomain(todoDoc: TodoDocument): Todo {
    return new Todo(
      todoDoc._id as any,
      todoDoc.title,
      todoDoc.description,
      todoDoc.status,
      todoDoc.ownerId.toString(),
    );
  }
}
