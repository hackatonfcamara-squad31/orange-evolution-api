import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentService } from './content.service';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

describe('ContentService', () => {
  let service: ContentService;

  const mockContent: Content[] = [
    {
      id: randomUUID(),
      moduleId: 5,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      moduleId: 4,
      creator_name: 'sasuke',
      title: 'Learn Next.js',
      link: 'www.medium.com',
      type: 'article',
      duration: 604800,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const mockContentRepository = {
    findOne: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
    create: jest.fn().mockImplementation(),
    preload: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: 'CONTENT_REPOSITORY',
          useValue: mockContentRepository,
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should throw an exception when passing a wrong id', async () => {
    const id = 'asdf';
    await expect(() => service.update(id, mockContent[0])).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw an exception when passing a wrong id', async () => {
    const id = 'asdf';
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

  it('should return all contents', async () => {
    mockContentRepository.find.mockReturnValue(mockContent);

    expect(await service.findAll()).toEqual(mockContent);

    expect(mockContentRepository.find).toHaveBeenCalled();
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
