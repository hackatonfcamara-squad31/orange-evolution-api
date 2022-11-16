import { BadRequestException, forwardRef, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Completed } from '../content-completed/entities/completed.entity';
import { CreateModuleDTO } from '../modules/dtos/create-module.dto';
import { Module } from '../modules/entities/module.entity';
import { ModulesModule } from '../modules/module.module';
import { ModulesService } from '../modules/module.service';
import { StorageModule } from '../storage/storage.module';
import { Trail } from '../trails/entities/trail.entity';
import { TrailsService } from '../trails/trail.service';
import { User } from '../users/entities/user.entity';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

describe('ContentService', () => {
  let service: ContentService;
  let moduleService: ModulesService;

  const mockUser: User = {
    id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c10',
    completed: [new Completed()],
    created_at: new Date(),
    email: 'kevin@email.com',
    is_admin: true,
    avatar: '',
    name: 'kevin',
    password: 'asdfgh',
    updated_at: new Date(),
  };

  const mockModule: Module = {
    contents: [new Content()],
    created_at: new Date(),
    updated_at: new Date(),
    id: randomUUID(),
    description: 'some description',
    order: 1,
    title: 'new module',
    trail: new Trail(),
  };

  const mockContent: Content[] = [
    {
      id: randomUUID(),
      module: mockModule,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
      completed: new Completed(),
    },
  ];

  const completed: Completed = {
    content: mockContent[0],
    id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c16',
    user: mockUser,
    created_at: new Date(),
  };

  const mockContentRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(() => mockContent),
    create: jest.fn().mockImplementation(),
    preload: jest.fn().mockImplementation(),
  };

  const createQueryBuilder = {
    select: () => createQueryBuilder,
    groupBy: () => createQueryBuilder,
    where: () => createQueryBuilder,
    getRawMany: () => [completed],
  };

  const mockCompletedRepository = {
    createQueryBuilder: jest.fn().mockImplementation(() => createQueryBuilder),
  };

  const mockModulesRepository = {
    findOne: jest.fn().mockReturnValue(mockModule),
  };

  const mockTrailsRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
    create: jest.fn().mockImplementation(),
    preload: jest.fn().mockImplementation(),
  };

  const mockModulesService = {
    findById: jest.fn().mockImplementation(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        ModulesService,
        TrailsService,
        {
          provide: 'CONTENT_REPOSITORY',
          useValue: mockContentRepository,
        },
        {
          provide: 'COMPLETED_REPOSITORY',
          useValue: mockCompletedRepository,
        },
        {
          provide: 'MODULE_REPOSITORY',
          useValue: mockModulesRepository,
        },
        {
          provide: 'TRAIL_REPOSITORY',
          useValue: mockTrailsRepository,
        },
      ],
      imports: [forwardRef(() => ModulesModule), StorageModule]
    })
      .compile();

    service = module.get<ContentService>(ContentService);
    moduleService = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception when passing a wrong id to update', async () => {
    const id = '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c14';
    await expect(() => service.update(id, mockContent[0])).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an exception when passing a wrong id to findById', async () => {
    const id = '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c14';
    await expect(() => service.findById(id)).rejects.toThrow(NotFoundException);
  });

  it('should throw an exception when passing an invalid id to findById', async () => {
    const id = 'asdf';
    await expect(() => service.findById(id)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an exception when passing an invalid id to getCompletedContents', async () => {
    const id = 'asdf';
    await expect(() => service.getCompletedContents(id)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should create a new content record and return that', async () => {
   
  });

  it('should update a content', async () => {
  
  });

  it('should return a list of contents completed by a given user', async () => {
 
  });

  it('should return all contents for a given user', async () => {
   
  });
});
