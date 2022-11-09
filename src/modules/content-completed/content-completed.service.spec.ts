import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from '../content/content.service';
import { UsersService } from '../users/user.service';
import { ContentCompletedService } from './content-completed.service';

describe('ContentCompletedService', () => {
  let service: ContentCompletedService;

  const mockCompletedRepository = {};
  const mockContentRepository = {};
  const mockUserRepository = {};

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
});
