import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../domain/user.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    type: String,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const USER_SCHEMA_NAME = 'User';
