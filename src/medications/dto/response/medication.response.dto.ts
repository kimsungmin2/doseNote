import { DoseUnit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MedicationResponseDto {
  @ApiProperty({
    example: 'cm9abc123456',
    description: '약물 프로필 ID',
  })
  id: string;

  @ApiProperty({
    example: 'Wegovy',
    description: '약물 이름',
  })
  medicationName: string;

  @ApiProperty({
    example: 0.25,
    description: '기본 용량 값',
  })
  defaultDosageValue: number;

  @ApiProperty({
    enum: DoseUnit,
    example: DoseUnit.MG,
    description: '기본 용량 단위',
  })
  defaultDosageUnit: DoseUnit;

  @ApiProperty({
    example: 7,
    description: '투여 주기(일)',
  })
  scheduleIntervalDays: number;

  @ApiProperty({
    example: '2026-03-12T00:00:00.000Z',
    description: '시작일',
  })
  startDate: Date;

  @ApiProperty({
    example: '저녁 식사 후 투여 시작',
    description: '메모',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    example: true,
    description: '활성 여부',
  })
  isActive: boolean;

  @ApiProperty({
    example: '2026-03-12T10:00:00.000Z',
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-12T10:00:00.000Z',
    description: '수정일',
  })
  updatedAt: Date;
}
