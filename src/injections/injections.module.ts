import { Module } from '@nestjs/common';
import { InjectionsService } from './injections.service';
import { InjectionsController } from './injections.controller';

@Module({
  controllers: [InjectionsController],
  providers: [InjectionsService],
})
export class InjectionsModule {}
