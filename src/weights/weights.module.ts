import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WeightsController } from './weights.controller';
import { WeightsService } from './weights.service';

@Module({
  imports: [PrismaModule],
  controllers: [WeightsController],
  providers: [WeightsService],
  exports: [WeightsService],
})
export class WeightsModule {}
