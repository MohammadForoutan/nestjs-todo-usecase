import { UserRole } from '../user.entity';

type FromDomainProps = {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive?: boolean;
};

export class UserReadModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastLoginAt?: Date,
    public readonly isActive?: boolean,
  ) {}

  static fromDomain(user: FromDomainProps): UserReadModel {
    return new UserReadModel(
      user.id,
      user.name,
      user.email,
      user.role ?? UserRole.USER,
      user.createdAt ?? new Date(),
      user.updatedAt ?? new Date(),
      user.lastLoginAt,
      user.isActive ?? true,
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt,
      isActive: this.isActive,
    };
  }
}
