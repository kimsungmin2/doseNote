import { Test, TestingModule } from '@nestjs/testing';
import { InjectionsService } from './injections.service';

describe('InjectionsService', () => {
  let service: InjectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InjectionsService],
    }).compile();

    service = module.get<InjectionsService>(InjectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
