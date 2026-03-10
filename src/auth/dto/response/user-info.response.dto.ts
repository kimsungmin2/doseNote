import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @ApiProperty({
    example: 'test@example.com',
    description: '이메일',
  })
  email: string;

  @ApiProperty({
    example: 'doseuser',
    description: '닉네임',
  })
  nickname: string;
}
