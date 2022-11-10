import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateTrailDTO } from './dtos/create-trail.dto';
import { UpdateTrailDTO } from './dtos/update-trail.dto';
import { TrailsController } from './trail.controller';
import { TrailsService } from './trail.service';

describe('TrailsController', () => {
  let controller: TrailsController;

  const mockTrailsService = {
    create: jest.fn().mockImplementation((dto: CreateTrailDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((dto: UpdateTrailDTO) => {
      return {
        ...dto,
      };
    }),
    delete: jest.fn().mockImplementation(() => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailsController],
      providers: [TrailsService],
    })
      .overrideProvider(TrailsService)
      .useValue(mockTrailsService)
      .compile();

    controller = module.get<TrailsController>(TrailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
