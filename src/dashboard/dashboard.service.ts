import { Injectable } from '@nestjs/common';
import { InjectionsService } from '../injections/injections.service';
import { MedicationsService } from '../medications/medications.service';
import { SymptomsService } from '../symptoms/symptoms.service';
import { WeightsService } from '../weights/weights.service';
import { HomeDashboardResponseDto } from './dto/response/home-dashboard.response.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly medicationsService: MedicationsService,
    private readonly injectionsService: InjectionsService,
    private readonly weightsService: WeightsService,
    private readonly symptomsService: SymptomsService,
  ) {}

  async getHome(userId: string): Promise<HomeDashboardResponseDto> {
    const activeMedication = await this.medicationsService.findActive(userId);
    const lastInjection = await this.injectionsService.findLatest(userId);
    const latestWeight = await this.weightsService.findLatest(userId);
    const weightSummary = await this.weightsService.getSummary(userId);
    const symptomSummary = await this.symptomsService.getSummary(userId);

    let nextInjection = null;

    if (activeMedication) {
      try {
        nextInjection = await this.injectionsService.findUpcoming(userId);
      } catch {
        nextInjection = null;
      }
    }

    return {
      activeMedication,
      lastInjection,
      nextInjection,
      latestWeight,
      weightSummary,
      symptomSummary,
    };
  }
}
