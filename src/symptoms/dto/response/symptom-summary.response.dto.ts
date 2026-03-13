import { SymptomType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { SymptomResponseDto } from './symptom.response.dto';

class SymptomFrequencyDto {
  @ApiProperty({
    enum: SymptomType,
    example: SymptomType.NAUSEA,
    description: '증상 종류',
  })
  symptomType: SymptomType;

  @ApiProperty({
    example: 4,
    description: '발생 횟수',
  })
  count: number;
}

export class SymptomSummaryResponseDto {
  @ApiProperty({
    type: SymptomFrequencyDto,
    isArray: true,
    description: '자주 기록된 증상 목록',
  })
  topSymptoms: SymptomFrequencyDto[];

  @ApiProperty({
    example: 2.8,
    nullable: true,
    description: '평균 증상 강도',
  })
  averageSeverity: number | null;

  @ApiProperty({
    type: SymptomResponseDto,
    isArray: true,
    description: '최근 증상 기록',
  })
  recentSymptoms: SymptomResponseDto[];
}
