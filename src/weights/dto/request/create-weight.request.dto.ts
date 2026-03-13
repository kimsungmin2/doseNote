import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWeightRequestDto {
  @ApiProperty({
    example: '2026-03-12T08:00:00.000Z',
    description: '체중 측정 일시',
  })
  @IsDateString()
  recordedAt: string;

  @ApiProperty({
    example: 78.4,
    description: '체중(kg)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.1)
  weightKg: number;

  @ApiProperty({
    example: '아침 공복 측정',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  memo?: string;
}
