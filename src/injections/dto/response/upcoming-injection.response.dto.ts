import { ApiProperty } from '@nestjs/swagger';

export class UpcomingInjectionResponseDto {
  @ApiProperty({
    example: '2026-03-12T09:00:00.000Z',
    nullable: true,
    description: '최근 주사 일시',
  })
  lastInjectedAt: Date | null;

  @ApiProperty({
    example: 7,
    description: '투여 주기(일)',
  })
  scheduleIntervalDays: number;

  @ApiProperty({
    example: '2026-03-19T09:00:00.000Z',
    description: '다음 예정 일시',
  })
  nextPlannedAt: Date;

  @ApiProperty({
    example: false,
    description: '오늘 투여 예정인지 여부',
  })
  isDueToday: boolean;

  @ApiProperty({
    example: 0,
    description: '지연 일수',
  })
  overdueDays: number;
}
