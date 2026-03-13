import { ApiProperty } from '@nestjs/swagger';

export class WeightResponseDto {
  @ApiProperty({
    example: 'cm9weight123456',
    description: '체중 기록 ID',
  })
  id: string;

  @ApiProperty({
    example: '2026-03-12T08:00:00.000Z',
    description: '체중 측정 일시',
  })
  recordedAt: Date;

  @ApiProperty({
    example: 78.4,
    description: '체중(kg)',
  })
  weightKg: number;

  @ApiProperty({
    example: '아침 공복 측정',
    description: '메모',
    nullable: true,
  })
  memo: string | null;

  @ApiProperty({
    example: '2026-03-12T08:10:00.000Z',
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-12T08:10:00.000Z',
    description: '수정일',
  })
  updatedAt: Date;
}
