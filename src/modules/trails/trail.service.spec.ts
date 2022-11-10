import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { StorageModule } from '../storage/storage.module';
import { Trail } from './entities/trail.entity';
import { TrailsService } from './trail.service';

describe('TrailsService', () => {
  let service: TrailsService;

  const mockTrailsRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation(),
    update: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
  };

  const mockTrails: Trail[] = [
    {
      id: randomUUID(),
      title: 'Programming Basics',
      icon_url: 'https://cdn.com/icon.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Programming Intermediate',
      icon_url: 'https://cdn.com/icon.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailsService,
        {
          provide: 'TRAIL_REPOSITORY',
          useValue: mockTrailsRepository,
        },
      ],
      imports: [StorageModule],
    }).compile();

    service = module.get<TrailsService>(TrailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
