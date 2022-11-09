import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentCompletedService } from '../content-completed/content-completed.service';
import { Completed } from '../content-completed/entities/completed.entity';
import { User } from '../users/entities/user.entity';
import { ContentService } from './content.service';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

describe('ContentService', () => {
  let service: ContentService;

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
  ];

  const completed: Completed = {
    content: mockContent[0],
    id: '2ab06422-eb5f-4348-b6b6-7c1cd1ce9c15',
    user: mockUser,
    created_at: new Date(),
  };

  const mockContentRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
    create: jest.fn().mockImplementation(),
    preload: jest.fn().mockImplementation(),
  };

  const mockCompletedRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: 'CONTENT_REPOSITORY',
          useValue: mockContentRepository,
        },
        {
          provide: 'COMPLETED_REPOSITORY',
          useValue: mockCompletedRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
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

  it('should create a new content record and return that', async () => {
    const newContent = {
      module_id: 5,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
    };

    mockContentRepository.save.mockReturnValue({
      id: randomUUID(),
      ...newContent,
    });

    expect(await service.create(newContent)).toEqual({
      id: expect.any(String),
      ...newContent,
    });

    expect(mockContentRepository.create).toHaveBeenCalledWith({
      ...newContent,
    });
  });

  it('should return a content given an id', async () => {
    const id = mockContent[0].id;
    const content = mockContent.filter((content) => content.id === id)[0];

    mockContentRepository.findOne.mockReturnValue(content);

    expect(await service.findById(id)).toEqual({
      ...content,
    });

    expect(mockContentRepository.findOne).toHaveBeenCalledWith({
      where: { id },
    });
    mockContentRepository.findOne.mockClear;
  });

  it('should update a content', async () => {
    const id = mockContent[0].id;
    const content = mockContent.filter((content) => content.id === id)[0];

    const updatedContent = {
      ...content,
      type: 'image',
    };

    const updateDto: UpdateContentDTO = new UpdateContentDTO({ type: 'image' });

    mockContentRepository.preload.mockReturnValue(updatedContent);
    mockContentRepository.save.mockReturnValue(updatedContent);

    expect(await service.update(id, updateDto)).toEqual(updatedContent);

    expect(mockContentRepository.preload).toBeCalled();
  });
});
