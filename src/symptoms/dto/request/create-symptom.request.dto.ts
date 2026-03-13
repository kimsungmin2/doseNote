import { SymptomType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSymptomRequestDto {
  @ApiProperty({
    example: 'cm9inj123456',
    description: '연결된 주사 기록 ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  injectionRecordId?: string;

  @ApiProperty({
    enum: SymptomType,
    example: SymptomType.NAUSEA,
    description: '증상 종류',
  })
  @IsEnum(SymptomType)
  symptomType: SymptomType;

  @ApiProperty({
    example: 3,
    description: '증상 강도(1~5)',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  severity: number;

  @ApiProperty({
    example: '2026-03-12T18:00:00.000Z',
    description: '증상 기록 일시',
  })
  @IsDateString()
  recordedAt: string;

  @ApiProperty({
    example: '주사 후 약간 메스꺼움',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;
}
