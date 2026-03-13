import { ApiProperty } from '@nestjs/swagger';

export class WeightSummaryResponseDto {
  @ApiProperty({
    example: 76.8,
    nullable: true,
    description: '현재 체중',
  })
  currentWeight: number | null;

  @ApiProperty({
    example: 82.3,
    nullable: true,
    description: '첫 기록 체중',
  })
  startWeight: number | null;

  @ApiProperty({
    example: -5.5,
    nullable: true,
    description: '시작 대비 변화량(kg)',
  })
  diffFromStart: number | null;

  @ApiProperty({
    example: -1.2,
    nullable: true,
    description: '최근 7일 변화량(kg)',
  })
  diff7d: number | null;

  @ApiProperty({
    example: -2.8,
    nullable: true,
    description: '최근 30일 변화량(kg)',
  })
  diff30d: number | null;
}
