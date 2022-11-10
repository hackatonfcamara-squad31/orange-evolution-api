import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentService } from '../content/content.service';
import { Content } from '../content/entities/content.entity';
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
    name: 'kevin',
    password: 'asdfgh',
    updated_at: new Date(),
  };

  const mockContent: Content[] = [
    {
      id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c15',
      module_id: 5,
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
      module_id: 5,
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
    }).compile();

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

    expect(
      await service.create({
        user_id: mockUser.id,
        content_id: mockContent[1].id,
      }),
    ).toEqual(completed);
  });

  it('should throw an error when trying to assign an already existing completed entry', async () => {
    mockCompletedRepository.findOne.mockReturnValue(mockCompleted[0]);
    await expect(async () => {
      await service.create({
        user_id: mockUser.id,
        content_id: mockContent[0].id,
      });
    }).rejects.toThrow(BadRequestException);
  });

  it('should delete a completed content status', async () => {
    mockCompletedRepository.findOne.mockReturnValue(mockCompleted[0]);

    expect(await service.deleteByContentId(mockCompleted[0].id)).toBe(
      mockCompleted[0],
    );
  });

  it("should throw an error when trying to delete an entry that doesn't exists", async () => {
    let completed: Completed;
    mockCompletedRepository.findOne.mockReturnValue(completed);

    await expect(
      async () => await service.deleteByContentId(randomUUID()),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error when not passing a correct UUID', async () => {
    const id = 'asdf';
    await expect(
      async () => await service.deleteByContentId(id),
    ).rejects.toThrow(BadRequestException);
  });
});
