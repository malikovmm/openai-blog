import {
  Body,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../user/entities/user.entity';
import { TokenVerificationResult } from './dto/token-validation.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(@Body() dto: LoginDto) {
    const user = await this.userService.findOneBy({
      where: {
        username: dto.username,
      },
    });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const passwordMatch = compareSync(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('user not found');

    const tokens = await this.generateTokens(user);
    const { affected } = await this.userService.update(user.id, {
      refreshToken: tokens.refreshToken,
    });
    if (!affected) {
      throw new InternalServerErrorException("can't update user");
    }
    return tokens;
  }

  async verifyAccessToken(token: string): Promise<TokenVerificationResult> {
    try {
      const decoded = verify(token, this.configService.get('JWT_SECRET'), {
        complete: true,
      });
      const userId = decoded.payload['userId'];
      const user = await this.userService.findById(userId);
      if (!user) {
        return new TokenVerificationResult(false, 'User not found');
      }
      return new TokenVerificationResult(true, null, user);
    } catch (e) {
      return new TokenVerificationResult(false, e.message);
    }
  }

  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(userId: number) {
    return sign({ userId }, this.configService.get('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_LIFETIME'),
    });
  }

  private async generateRefreshToken(userId: number) {
    return sign({ userId }, this.configService.get('JWT_SECRET'), {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_LIFETIME'),
    });
  }
}
