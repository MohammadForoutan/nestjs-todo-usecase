type FromDomainProps = {
  id: string;
  title: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  status: string;
  ownerName?: string;
  completedAt?: Date;
  priority: string;
};
export class TodoReadModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly ownerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly description?: string,
    public readonly status: string = 'pending',
    public readonly ownerName?: string,
    public readonly completedAt?: Date,
    public readonly priority: string = 'medium',
  ) {}

  static fromDomain(todo: FromDomainProps): TodoReadModel {
    return new TodoReadModel(
      todo.id,
      todo.title,
      todo.ownerId,
      todo.createdAt ?? new Date(),
      todo.updatedAt ?? new Date(),
      todo.description,
      todo.status ?? 'pending',
      todo.ownerName,
      todo.completedAt,
      todo.priority ?? 'medium',
    );
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      ownerId: this.ownerId,
      ownerName: this.ownerName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt,
      priority: this.priority,
    };
  }
}
