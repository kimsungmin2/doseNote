import { Test, TestingModule } from '@nestjs/testing';
import { InjectionsController } from './injections.controller';
import { InjectionsService } from './injections.service';

describe('InjectionsController', () => {
  let controller: InjectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InjectionsController],
      providers: [InjectionsService],
    }).compile();

    controller = module.get<InjectionsController>(InjectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
