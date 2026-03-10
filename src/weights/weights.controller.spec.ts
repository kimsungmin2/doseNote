import { Test, TestingModule } from '@nestjs/testing';
import { WeightsController } from './weights.controller';
import { WeightsService } from './weights.service';

describe('WeightsController', () => {
  let controller: WeightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeightsController],
      providers: [WeightsService],
    }).compile();

    controller = module.get<WeightsController>(WeightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
