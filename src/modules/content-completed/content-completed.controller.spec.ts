import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Content } from '../content/entities/content.entity';
import { User } from '../users/entities/user.entity';
import { ContentCompletedController } from './content-completed.controller';
import { ContentCompletedService } from './content-completed.service';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

describe('ContentCompletedController', () => {
  let controller: ContentCompletedController;

  const completed: Completed = {
    id: randomUUID(),
    content: new Content(),
    user: new User(),
    created_at: new Date(),
  };

  const mockContentCompletedService = {
    create: jest.fn().mockImplementation(() => completed),
    deleteByContentId: jest.fn().mockImplementation(() => completed),
  };

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

  it('should return a new completed entry', async () => {
    const createDto: CreateCompletedStatusDTO = {
      content_id: randomUUID(),
      user_id: randomUUID(),
    };

    expect(await controller.createCompletedStatus(createDto)).toEqual(
      completed,
    );
  });

  it('should delete a completed status', async () => {
    expect(await controller.deleteCompletedStatus(randomUUID())).toEqual(
      completed,
    );
  });
});
