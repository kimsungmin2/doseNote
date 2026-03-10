import { ApiProperty } from '@nestjs/swagger';
import { UserInfoResponseDto } from './user-info.response.dto';

export class AuthResponseDto {
  @ApiProperty({
    type: UserInfoResponseDto,
    description: '사용자 정보',
  })
  user: UserInfoResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access Token',
  })
  accessToken: string;
}
