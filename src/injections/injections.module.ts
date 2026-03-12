import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InjectionsController } from './injections.controller';
import { InjectionsService } from './injections.service';

@Module({
  imports: [PrismaModule],
  controllers: [InjectionsController],
  providers: [InjectionsService],
  exports: [InjectionsService],
})
export class InjectionsModule {}
