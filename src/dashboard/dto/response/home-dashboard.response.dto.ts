import { ApiProperty } from '@nestjs/swagger';
import { MedicationResponseDto } from '../../../medications/dto/response/medication.response.dto';
import { InjectionResponseDto } from '../../../injections/dto/response/injection.response.dto';
import { UpcomingInjectionResponseDto } from '../../../injections/dto/response/upcoming-injection.response.dto';
import { WeightResponseDto } from '../../../weights/dto/response/weight.response.dto';
import { WeightSummaryResponseDto } from '../../../weights/dto/response/weight-summary.response.dto';
import { SymptomSummaryResponseDto } from '../../../symptoms/dto/response/symptom-summary.response.dto';

export class HomeDashboardResponseDto {
  @ApiProperty({
    type: MedicationResponseDto,
    nullable: true,
    description: '현재 활성 약물 프로필',
  })
  activeMedication: MedicationResponseDto | null;

  @ApiProperty({
    type: InjectionResponseDto,
    nullable: true,
    description: '가장 최근 주사 기록',
  })
  lastInjection: InjectionResponseDto | null;

  @ApiProperty({
    type: UpcomingInjectionResponseDto,
    nullable: true,
    description: '다음 주사 예정 정보',
  })
  nextInjection: UpcomingInjectionResponseDto | null;

  @ApiProperty({
    type: WeightResponseDto,
    nullable: true,
    description: '가장 최근 체중 기록',
  })
  latestWeight: WeightResponseDto | null;

  @ApiProperty({
    type: WeightSummaryResponseDto,
    description: '체중 요약 정보',
  })
  weightSummary: WeightSummaryResponseDto;

  @ApiProperty({
    type: SymptomSummaryResponseDto,
    description: '증상 요약 정보',
  })
  symptomSummary: SymptomSummaryResponseDto;
}
