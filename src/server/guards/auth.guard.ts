import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpArgumentsHost = context.switchToHttp();
    const req = httpArgumentsHost.getRequest<Request>();
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }
    const authData = authHeader.split(' ');
    const [authScheme, authToken] = authData;
    if (authScheme?.toLowerCase() !== 'bearer' || !authToken) {
      throw new ForbiddenException('Wrong authorization data');
    }
    const verificationResult = await this.authService.verifyAccessToken(
      authToken,
    );
    if (!verificationResult.success) {
      throw new UnauthorizedException(verificationResult.message);
    }
    Reflect.defineMetadata(
      'user',
      verificationResult.user,
      context.getHandler(),
    );
    return true;
  }
}
