import { Module } from '@nestjs/common';
import { WeightsService } from './weights.service';
import { WeightsController } from './weights.controller';

@Module({
  controllers: [WeightsController],
  providers: [WeightsService],
})
export class WeightsModule {}
