import { DoseUnit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMedicationRequestDto {
  @ApiProperty({
    example: 'Wegovy',
    description: '약물 이름',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  medicationName: string;

  @ApiProperty({
    example: 0.25,
    description: '기본 용량 값',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  defaultDosageValue: number;

  @ApiProperty({
    enum: DoseUnit,
    example: DoseUnit.MG,
    description: '기본 용량 단위',
  })
  @IsEnum(DoseUnit)
  defaultDosageUnit: DoseUnit;

  @ApiProperty({
    example: 7,
    description: '투여 주기(일)',
  })
  @IsNumber()
  @Min(1)
  scheduleIntervalDays: number;

  @ApiProperty({
    example: '2026-03-12T00:00:00.000Z',
    description: '복용/투여 시작일',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '저녁 식사 후 투여 시작',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
