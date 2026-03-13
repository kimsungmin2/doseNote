import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SymptomsController } from './symptoms.controller';
import { SymptomsService } from './symptoms.service';

@Module({
  imports: [PrismaModule],
  controllers: [SymptomsController],
  providers: [SymptomsService],
  exports: [SymptomsService],
})
export class SymptomsModule {}
