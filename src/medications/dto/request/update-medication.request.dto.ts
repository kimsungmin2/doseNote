import { DoseUnit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateMedicationRequestDto {
  @ApiProperty({
    example: 'Wegovy',
    description: '약물 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  medicationName?: string;

  @ApiProperty({
    example: 0.5,
    description: '기본 용량 값',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  defaultDosageValue?: number;

  @ApiProperty({
    enum: DoseUnit,
    example: DoseUnit.MG,
    description: '기본 용량 단위',
    required: false,
  })
  @IsOptional()
  @IsEnum(DoseUnit)
  defaultDosageUnit?: DoseUnit;

  @ApiProperty({
    example: 7,
    description: '투여 주기(일)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  scheduleIntervalDays?: number;

  @ApiProperty({
    example: '2026-03-12T00:00:00.000Z',
    description: '복용/투여 시작일',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '용량 증량 예정',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiProperty({
    example: true,
    description: '활성 여부',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
