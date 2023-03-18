import SessionVerificationErrors from '../auth.enum';
import { User } from '../entities/user.entity';

export class SessionVerificationResult {
  constructor(
    public success: boolean,
    public message?: SessionVerificationErrors,
    public user?: User,
  ) {}
}
