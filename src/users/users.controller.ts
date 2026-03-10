import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiOperation({
  //   summary: '회원가입',
  // })
  // @ApiResponse({
  //   status: 201,
  //   type: UserInfoResponseDto,
  // })
  // @Post('signup')
  // @HttpCode(HttpStatus.CREATED)
  // async signUp(
  //   @Body() dto: CreateUserRequestDto,
  // ): Promise<UserInfoResponseDto> {
  //   const user = await this.usersService.createUser(dto);

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     nickname: user.nickname,
  //   };
  // }
}
