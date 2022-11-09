import { Test, TestingModule } from '@nestjs/testing';
import { ContentCompletedController } from './content-completed.controller';
import { ContentCompletedService } from './content-completed.service';

describe('ContentCompletedController', () => {
  let controller: ContentCompletedController;

  const mockContentCompletedService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentCompletedController],
      providers: [ContentCompletedService],
    })
      .overrideProvider(ContentCompletedService)
      .useValue(mockContentCompletedService)
      .compile();

    controller = module.get<ContentCompletedController>(
      ContentCompletedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
