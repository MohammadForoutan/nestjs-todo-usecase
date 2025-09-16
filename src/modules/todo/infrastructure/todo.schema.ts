import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TodoStatus } from '../domain/todo.entity';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    required: true,
    enum: Object.values(TodoStatus),
    default: TodoStatus.PENDING,
    type: String,
  })
  status: TodoStatus;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerId: Types.ObjectId;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
export const TODO_SCHEMA_NAME = 'Todo';
