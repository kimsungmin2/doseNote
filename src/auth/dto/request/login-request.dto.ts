import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'test@example.com',
    description: '이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  password: string;
}
