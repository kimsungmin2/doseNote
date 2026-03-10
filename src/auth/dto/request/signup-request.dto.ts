import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'example@example.com',
    description: '이메일',
  })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @ApiProperty({
    example: '123456',
    description: '비밀번호',
  })
  @MinLength(6)
  @MaxLength(16)
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsString()
  @ApiProperty({
    example: '123456',
    description: '비밀번호 체크',
  })
  @MinLength(6)
  @MaxLength(16)
  @IsNotEmpty({ message: '체크 비밀번호를 입력해주세요.' })
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '성수동 잠만보',
    description: '닉네임',
  })
  @MinLength(2)
  @MaxLength(8)
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickName: string;
}
