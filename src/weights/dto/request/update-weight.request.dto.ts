import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateWeightRequestDto {
  @ApiProperty({
    example: '2026-03-12T08:00:00.000Z',
    description: '체중 측정 일시',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  recordedAt?: string;

  @ApiProperty({
    example: 77.9,
    description: '체중(kg)',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  weightKg?: number;

  @ApiProperty({
    example: '저녁 식사 후라 조금 높음',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  memo?: string;
}
