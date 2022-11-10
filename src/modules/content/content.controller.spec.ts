import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ContentCompletedService } from '../content-completed/content-completed.service';
import { Completed } from '../content-completed/entities/completed.entity';
import { User } from '../users/entities/user.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

describe('ContentController', () => {
  let controller: ContentController;
  const mockContent: Content[] = [
    {
      id: randomUUID(),
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

  const mockContentService = {
    create: jest.fn().mockImplementation((dto: CreateContentDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
    update: jest
      .fn()
      .mockImplementation((id: string, updatedContent: UpdateContentDTO) => {
        return { ...updatedContent, id };
      }),
    findById: jest.fn().mockReturnValue(mockContent[0]),
    findAll: jest.fn().mockImplementation(() => {
      return mockContent;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentController],
      providers: [ContentService],
    })
      .overrideProvider(ContentService)
      .useValue(mockContentService)
      .compile();

    controller = module.get<ContentController>(ContentController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  it('should create a new content', async () => {
    const content = await controller.createContent({
      module_id: 5,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
    });

    expect(content).toEqual({
      id: expect.any(String),
      module_id: 5,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
    });

    expect(mockContentService.create).toHaveBeenCalled();
  });

  it('should return one content given an ID', async () => {
    expect(await controller.getContentById('asdf')).toEqual(mockContent[0]);
  });

  it('should return all contents', async () => {
    expect(await controller.getContents(new User())).toEqual(mockContent);
  });

  it('should return an updated content', async () => {
    const id = 'asdf';
    const updatedContent = await controller.update(id, mockContent[0]);
    expect(updatedContent).toEqual({ ...mockContent[0], id });
  });
});
