import { Test, TestingModule } from '@nestjs/testing';
import { ContentCompletedController } from './content-completed.controller';

describe('ContentCompletedController', () => {
  let controller: ContentCompletedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentCompletedController],
    }).compile();

    controller = module.get<ContentCompletedController>(
      ContentCompletedController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
