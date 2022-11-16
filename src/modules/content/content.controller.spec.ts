import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Completed } from '../content-completed/entities/completed.entity';
import { Module } from '../modules/entities/module.entity';
import { Trail } from '../trails/entities/trail.entity';
import { User } from '../users/entities/user.entity';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

describe('ContentController', () => {
  let controller: ContentController;

  const mockTrail: Trail = {
    title: 'new trail title',
    created_at: new Date(),
    updated_at: new Date(),
    id: randomUUID(),
    icon_url: 'www.icon.com',
    modules: [new Module()],
  };

  const mockModule: Module = {
    contents: [new Content()],
    created_at: new Date(),
    updated_at: new Date(),
    id: randomUUID(),
    description: 'some description',
    order: 1,
    title: 'new module',
    trail: mockTrail,
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
      module_id: mockModule.id,
      order: 2,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
    });

    expect(content).toEqual({
      id: expect.any(String),
      module_id: expect.any(String),
      order: 2,
      creator_name: 'naruto',
      title: 'Learn Nest.js',
      link: 'www.youtube.com',
      type: 'video',
      duration: 86400,
    });

    expect(mockContentService.create).toHaveBeenCalled();
  });

  it('should return one content given an ID', async () => {
    const user = new User();
    expect(await controller.getContentById(user, mockContent[0].id)).toEqual(
      mockContent[0],
    );
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
