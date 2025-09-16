import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IUserRepository } from '../domain/user.repository';
import { User, UserRole } from '../domain/user.entity';
import { UserDocument, UserSchema, USER_SCHEMA_NAME } from './user.schema';

@Injectable()
export class MongooseUserRepository implements IUserRepository {
  constructor(
    @InjectModel(USER_SCHEMA_NAME) private userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });

    const savedUser = await createdUser.save();
    return this.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? this.toDomain(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user ? this.toDomain(user) : null;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, userData, { new: true })
      .exec();
    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private toDomain(userDoc: UserDocument): User {
    return new User(
      (userDoc._id as any).toString(),
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.role,
    );
  }
}
