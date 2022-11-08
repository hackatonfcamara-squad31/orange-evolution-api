import { Test, TestingModule } from '@nestjs/testing';
import { ContentCompletedService } from './content-completed.service';

describe('ContentCompletedService', () => {
  let service: ContentCompletedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentCompletedService],
    }).compile();

    service = module.get<ContentCompletedService>(ContentCompletedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
