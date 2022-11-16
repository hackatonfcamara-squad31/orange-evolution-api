import { BadRequestException, forwardRef, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentService } from '../content/content.service';
import { Content } from '../content/entities/content.entity';
import { ModulesModule } from '../modules/module.module';
import { StorageModule } from '../storage/storage.module';
import { Trail } from '../trails/entities/trail.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { ContentCompletedService } from './content-completed.service';
import { Completed } from './entities/completed.entity';

describe('ContentCompletedService', () => {
  let service: ContentCompletedService;

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

  const mockModule = {
    id: randomUUID(),
    title: 'Programming Basics',
    order: 1,
    contents: [new Content()],
    description: 'some description',
    trail: new Trail(),
    created_at: new Date(),
    updated_at: new Date(),
  }

  const mockContent: Content[] = [
    {
      id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c15',
      module: mockModule,
      order: 1,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
      created_at: new Date(),
      updated_at: new Date(),
      completed: new Completed(),
    },
    {
      id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c10',
      module: mockModule,
      order: 2,
      creator_name: 'sasuke',
      title: 'Learn Next.js',
      link: 'www.medium.com',
      type: 'text',
      duration: 500,
      created_at: new Date(),
      updated_at: new Date(),
      completed: new Completed(),
    },
  ];

  const mockCompleted: Completed[] = [
    {
      content: mockContent[0],
      user: mockUser,
      id: randomUUID(),
      created_at: new Date(),
    },
  ];

  const mockContentCompletedService = {
    create: jest.fn().mockImplementation(),
    deleteByContentId: jest.fn().mockImplementation()
  }

  const mockCompletedRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    remove: jest.fn().mockImplementation((item) => item),
  };

  const mockContentRepository = {
    findOne: jest.fn().mockImplementation(),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        ContentCompletedService,
        { provide: 'COMPLETED_REPOSITORY', useValue: mockCompletedRepository },
        { provide: 'CONTENT_REPOSITORY', useValue: mockContentRepository },
        { provide: 'USER_REPOSITORY', useValue: mockUserRepository },
        UsersService,
      ],
      imports: [forwardRef(() => ModulesModule), StorageModule]
    })
      .overrideProvider(ContentCompletedService)
      .useValue(mockContentCompletedService)
      .compile();

    service = module.get<ContentCompletedService>(ContentCompletedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new completed entry', async () => {
    let completedEmpty: Completed;
    mockCompletedRepository.findOne.mockReturnValue(completedEmpty);
    mockContentRepository.findOne.mockReturnValue(mockContent[1]);
    mockUserRepository.findOne.mockReturnValue(mockUser);

    const completed: Completed = {
      content: mockContent[1],
      created_at: new Date(),
      user: mockUser,
      id: randomUUID(),
    };

    mockCompletedRepository.save.mockReturnValue(completed);

    mockContentCompletedService.create.mockReturnValue(completed)

    expect(
      await service.create({
        user_id: mockUser.id,
        content_id: mockContent[1].id,
      }),
    ).toEqual(completed);
  });

  it('should delete a completed content status', async () => {
    mockCompletedRepository.findOne.mockReturnValue(mockCompleted[0]);

    await service.deleteByContentId(mockCompleted[0].id, mockUser)

    expect(mockContentCompletedService.deleteByContentId).toHaveBeenCalled();
  });

  it("should throw an error when trying to delete an entry that doesn't exists", async () => {
    let completed: Completed;
    mockCompletedRepository.findOne.mockReturnValue(completed);

    mockContentCompletedService.deleteByContentId.mockRejectedValue(() => {
      throw new NotFoundException('Conteúdo com não encontrado')
    })

    await expect(
      async () => await service.deleteByContentId(randomUUID(), mockUser),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error when not passing a correct UUID', async () => {
    const id = 'asdf';

    mockContentCompletedService.deleteByContentId.mockRejectedValue(() => {
      throw new BadRequestException('Status de conteúdo já foi registrado')
    })

    await expect(
      async () => await service.deleteByContentId(id, mockUser),
    ).rejects.toThrow(BadRequestException);
  });
});
