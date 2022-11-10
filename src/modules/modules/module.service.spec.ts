import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { StorageModule } from '../storage/storage.module';
import { Module } from './entities/module.entity';
import { ModulesService } from './module.service';

describe('ModulesService', () => {
  let service: ModulesService;

  const mockModulesRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation(),
    update: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
  };

  const mockModules: Module[] = [
    {
      id: randomUUID(),
      title: 'Programming Basics',
      order: 1,
      icon_url: 'https://cdn.com/icon.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      title: 'Programming Intermediate',
      order: 2,
      icon_url: 'https://cdn.com/icon.jpeg',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: 'MODULE_REPOSITORY',
          useValue: mockModulesRepository,
        },
      ],
      imports: [StorageModule],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new module record and return that', async () => {
    const newModule = {
      title: 'Programming Intermediate',
      order: 1,
      icon: 'icon.jpeg',
    };

    mockModulesRepository.save.mockReturnValue({
      id: randomUUID(),
      ...newModule,
    });

    expect(await service.create(newModule)).toEqual({
      id: expect.any(String),
      icon: expect.any(String),
      order: newModule.order,
      title: newModule.title,
    });

    expect(mockModulesRepository.create).toHaveBeenCalledWith({
      icon_url: expect.any(String),
      order: newModule.order,
      title: newModule.title,
    });

    expect(mockModulesRepository.save).toHaveBeenCalled();
  });

  it('should update an existing module', async () => {
    const newModule = {
      title: 'Programming Interte',
      order: 1,
      icon: 'icon.jpeg',
    };

    const createdModule = await service.create(newModule);

    mockModulesRepository.findOne.mockReturnValue({
      ...createdModule,
    });

    mockModulesRepository.update.mockReturnValue({
      ...createdModule,
      title: 'Programming Intermediate',
    });

    expect(
      await service.update({
        id: createdModule.id,
        title: 'Programming Intermediate',
      }),
    ).toEqual({
      id: expect.any(String),
      icon: expect.any(String),
      order: createdModule.order,
      title: 'Programming Intermediate',
    });

    expect(mockModulesRepository.update).toHaveBeenCalled();
  });

  it('should reorder the modules based on user input', async () => {
    mockModulesRepository.find.mockReturnValue(mockModules);

    await service.reorder({ id: mockModules[1].id, order: 1 });

    expect(mockModulesRepository.update).toHaveBeenCalled();
  });
});
