import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { AUTH_MESSAGES } from '../auth/auth.contants';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { SignupRequestDto } from './dto/request/signup-request.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { UserInfoResponseDto } from './dto/response/user-info.response.dto';
import { JwtPayload } from '../utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    const accessToken = await this.generateAccessToken(user);

    return {
      user: this.toUserInfoDto(user),
      accessToken,
    };
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

    const accessToken = await this.generateAccessToken(user);

    return {
      user: this.toUserInfoDto(user),
      accessToken,
    };
  }

  async me(userId: string): Promise<UserInfoResponseDto> {
    const user = await this.usersService.getByIdOrThrow(userId);
    return this.toUserInfoDto(user);
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }

  private toUserInfoDto(user: User): UserInfoResponseDto {
    return {
      email: user.email,
      nickname: user.nickname,
    };
  }
}
