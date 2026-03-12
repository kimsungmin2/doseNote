import { DoseUnit, InjectionSite } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsNumber,
} from 'class-validator';

export class CreateInjectionRequestDto {
  @ApiProperty({
    example: 'cm9abc123456',
    description: '약물 프로필 ID',
  })
  @IsString()
  medicationProfileId: string;

  @ApiProperty({
    example: '2026-03-12T09:00:00.000Z',
    description: '주사 투여 일시',
  })
  @IsDateString()
  injectedAt: string;

  @ApiProperty({
    example: 0.25,
    description: '실제 투여 용량 값',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  dosageValue?: number;

  @ApiProperty({
    enum: DoseUnit,
    example: DoseUnit.MG,
    description: '실제 투여 용량 단위',
    required: false,
  })
  @IsOptional()
  @IsEnum(DoseUnit)
  dosageUnit?: DoseUnit;

  @ApiProperty({
    enum: InjectionSite,
    example: InjectionSite.ABDOMEN,
    description: '주사 부위',
  })
  @IsEnum(InjectionSite)
  injectionSite: InjectionSite;

  @ApiProperty({
    example: '복부 우측에 투여',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  memo?: string;
}
