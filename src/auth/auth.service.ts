import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AUTH_MESSAGES } from './auth.constants';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token-request.dto';
import { SignupRequestDto } from './dto/request/signup-request.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { UserInfoResponseDto } from './dto/response/user-info.response.dto';
import { JwtPayload } from '../utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupRequestDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      nickname: dto.nickname,
    });

    return this.issueAuthTokens(user);
  }

  async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    return this.issueAuthTokens(user);
  }

  async refresh(dto: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    const payload = await this.verifyRefreshToken(dto.refreshToken);

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const isMatch = await bcrypt.compare(
      dto.refreshToken,
      storedToken.tokenHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    await this.prisma.refreshToken.update({
      where: {
        id: storedToken.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return this.issueAuthTokens(user);
  }

  async logout(userId: string, dto: RefreshTokenRequestDto): Promise<void> {
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    for (const token of activeTokens) {
      const isMatch = await bcrypt.compare(dto.refreshToken, token.tokenHash);

      if (isMatch) {
        await this.prisma.refreshToken.update({
          where: { id: token.id },
          data: { revokedAt: new Date() },
        });

        return;
      }
    }

    throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
  }

  async me(userId: string): Promise<UserInfoResponseDto> {
    const user = await this.usersService.getByIdOrThrow(userId);
    return this.toUserInfoDto(user);
  }

  private async issueAuthTokens(user: User): Promise<AuthResponseDto> {
    const { accessToken, refreshToken, refreshExpiresAt } =
      await this.generateTokens(user);

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      user: this.toUserInfoDto(user),
      accessToken,
      refreshToken,
    };
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    refreshExpiresAt: Date;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
    });

    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshExpiresIn,
    });

    const refreshExpiresAt = this.calculateExpirationDate(refreshExpiresIn);

    return {
      accessToken,
      refreshToken,
      refreshExpiresAt,
    };
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();

    if (expiresIn.endsWith('d')) {
      const days = Number(expiresIn.replace('d', ''));
      return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }

    if (expiresIn.endsWith('h')) {
      const hours = Number(expiresIn.replace('h', ''));
      return new Date(now.getTime() + hours * 60 * 60 * 1000);
    }

    if (expiresIn.endsWith('m')) {
      const minutes = Number(expiresIn.replace('m', ''));
      return new Date(now.getTime() + minutes * 60 * 1000);
    }

    if (expiresIn.endsWith('s')) {
      const seconds = Number(expiresIn.replace('s', ''));
      return new Date(now.getTime() + seconds * 1000);
    }

    const fallbackDays = 7;
    return new Date(now.getTime() + fallbackDays * 24 * 60 * 60 * 1000);
  }

  private toUserInfoDto(user: User): UserInfoResponseDto {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };
  }
}
