import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User, RefreshToken } from '../generated/prisma/client';
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
      nickname: dto.nickName,
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

  async refresh(
    userId: string,
    tokenId: string,
    rawRefreshToken: string,
  ): Promise<AuthResponseDto> {
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        id: tokenId,
        userId,
        revokedAt: null,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED);
    }

    const isMatch = await bcrypt.compare(
      rawRefreshToken,
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

    const user = await this.usersService.getByIdOrThrow(userId);

    return this.issueAuthTokens(user);
  }

  async logout(userId: string, dto: RefreshTokenRequestDto): Promise<void> {
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
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
    const accessToken = await this.generateAccessToken(user);

    const refreshTokenRow = await this.createRefreshTokenRow(user.id);
    const refreshToken = await this.generateRefreshToken(
      user,
      refreshTokenRow.id,
    );
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.update({
      where: {
        id: refreshTokenRow.id,
      },
      data: {
        tokenHash: refreshTokenHash,
      },
    });

    return {
      user: this.toUserInfoDto(user),
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'access',
    };

    return this.jwtService.signAsync<JwtPayload>(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
        10,
      ),
    });
  }

  private async generateRefreshToken(
    user: User,
    tokenId: string,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: 'refresh',
      jti: tokenId,
    };

    return this.jwtService.signAsync<JwtPayload>(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
        10,
      ),
    });
  }

  private async createRefreshTokenRow(userId: string): Promise<RefreshToken> {
    const refreshExpiresIn =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';

    return this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: '',
        expiresAt: this.calculateExpirationDate(refreshExpiresIn),
      },
    });
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

    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }

  private toUserInfoDto(user: User): UserInfoResponseDto {
    return {
      email: user.email,
      nickname: user.nickname,
    };
  }
}
