import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { SessionVerificationResult } from './dto/session-validation.dto';
import { v4 as uuid } from 'uuid';
import ms from 'ms';
import { UserRepository } from './user.repository';
import SessionValidationMessages from './auth.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  public async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const passwordMatch = compareSync(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('user not found');

    return await this.updateSession(user);
  }

  public async verifySession(
    sessId: string,
  ): Promise<SessionVerificationResult> {
    const user = await this.usersRepository.findOne({
      where: { sessionId: sessId },
    });
    if (!user) {
      return new SessionVerificationResult(
        false,
        SessionValidationMessages.USER_NOT_FOUND,
        user,
      );
    }
    if (user.expireAt && user.expireAt < new Date()) {
      return new SessionVerificationResult(
        false,
        SessionValidationMessages.SESSION_EXPIRED,
        user,
      );
    }
    await this.updateExpiration(user);
    return new SessionVerificationResult(true, null, user);
  }

  private updateExpiration(user: User) {
    return this.usersRepository.save({
      id: user.id,
      expireAt: this.getExpirationTime(),
    });
  }

  private getExpirationTime() {
    const sessionExpirationTime = ms(
      this.configService.get('SESSION_EXPIRATION_TIME'),
    );
    return new Date(Date.now() + sessionExpirationTime);
  }

  private updateSession(user: User) {
    return this.usersRepository.save({
      id: user.id,
      sessionId: uuid(),
      expireAt: this.getExpirationTime(),
    });
  }
}
