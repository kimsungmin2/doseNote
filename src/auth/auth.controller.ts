import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token-request.dto';
import { SignupRequestDto } from './dto/request/signup-request.dto';
import { AuthResponseDto } from './dto/response/auth.response.dto';
import { LogoutResponseDto } from './dto/response/logout.response.dto';
import { UserInfoResponseDto } from './dto/response/user-info.response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUserData } from './interfaces/current-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
  })
  @ApiResponse({
    status: 201,
    type: AuthResponseDto,
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupRequestDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto);
  }

  @ApiOperation({
    summary: '로그인',
  })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: '토큰 재발급',
  })
  @ApiResponse({
    status: 200,
    type: AuthResponseDto,
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto);
  }

  @ApiOperation({
    summary: '로그아웃',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: LogoutResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: RefreshTokenRequestDto,
  ): Promise<LogoutResponseDto> {
    await this.authService.logout(user.id, dto);

    return {
      success: true,
    };
  }

  @ApiOperation({
    summary: '내 정보 조회',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: UserInfoResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: CurrentUserData): Promise<UserInfoResponseDto> {
    return this.authService.me(user.id);
  }
}
