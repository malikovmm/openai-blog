import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { setSession } from '../util/http';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpArgumentsHost = context.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();
    const res = httpArgumentsHost.getResponse<Response>();
    const sessionId = req.cookies['poltavsky-sessid'];
    if (!sessionId) {
      throw new UnauthorizedException('can not find session on request');
    }
    const result = await this.authService.verifySession(sessionId);
    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }
    setSession(res, result.user.sessionId, result.user.expireAt);
    Reflect.defineMetadata('user', result.user, context.getHandler());
    return true;
  }
}
