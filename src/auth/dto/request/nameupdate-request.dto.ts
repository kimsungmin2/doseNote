import { PartialType } from '@nestjs/mapped-types';
import { SignupRequestDto } from './signup-request.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NameUpdateDto extends PartialType(SignupRequestDto) {
  @IsString()
  @ApiProperty({
    example: '성수동 잠만보',
    description: '닉네임',
  })
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickName: string;
}
