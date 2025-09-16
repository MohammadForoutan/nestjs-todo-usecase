import { UserRole } from '../../modules/user/domain/user.entity';

export interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    role: UserRole;
  };
}
