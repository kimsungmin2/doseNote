import { Module } from '@nestjs/common';
import { InjectionsModule } from '../injections/injections.module';
import { MedicationsModule } from '../medications/medications.module';
import { SymptomsModule } from '../symptoms/symptoms.module';
import { WeightsModule } from '../weights/weights.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [MedicationsModule, InjectionsModule, WeightsModule, SymptomsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
