import { User } from '../../user/entities/user.entity';

export class TokenVerificationResult {
  constructor(
    public success: boolean,
    public message?: string,
    public user?: User,
  ) {}
}
