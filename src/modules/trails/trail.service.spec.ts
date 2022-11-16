import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentService } from '../content/content.service';
import { Module } from '../modules/entities/module.entity';
import { ModulesService } from '../modules/module.service';
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

  const mockModulesRepository = {};

  const mockContentRepository = {};

  const mockContentCompletedRepository = {};

  const mockTrails: Trail[] = [
    {
      id: randomUUID(),
      title: 'Programming Basics',
      icon_url: 'https://cdn.com/icon.jpeg',
      modules: [new Module()],
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Programming Intermediate',
      icon_url: 'https://cdn.com/icon.jpeg',
      modules: [new Module()],
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrailsService,
        ModulesService,
        ContentService,
        {
          provide: 'TRAIL_REPOSITORY',
          useValue: mockTrailsRepository,
        },
        {
          provide: 'MODULE_REPOSITORY',
          useValue: mockModulesRepository,
        },
        {
          provide: 'CONTENT_REPOSITORY',
          useValue: mockContentRepository,
        },
        {
          provide: 'COMPLETED_REPOSITORY',
          useValue: mockContentCompletedRepository,
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
