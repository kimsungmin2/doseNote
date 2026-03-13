import { SymptomType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SymptomResponseDto {
  @ApiProperty({
    example: 'cm9sym123456',
    description: '증상 기록 ID',
  })
  id: string;

  @ApiProperty({
    example: 'cm9inj123456',
    nullable: true,
    description: '연결된 주사 기록 ID',
  })
  injectionRecordId: string | null;

  @ApiProperty({
    enum: SymptomType,
    example: SymptomType.NAUSEA,
    description: '증상 종류',
  })
  symptomType: SymptomType;

  @ApiProperty({
    example: 3,
    description: '증상 강도(1~5)',
  })
  severity: number;

  @ApiProperty({
    example: '2026-03-12T18:00:00.000Z',
    description: '증상 기록 일시',
  })
  recordedAt: Date;

  @ApiProperty({
    example: '주사 후 약간 메스꺼움',
    nullable: true,
    description: '메모',
  })
  memo: string | null;

  @ApiProperty({
    example: '2026-03-12T18:10:00.000Z',
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-03-12T18:10:00.000Z',
    description: '수정일',
  })
  updatedAt: Date;
}
