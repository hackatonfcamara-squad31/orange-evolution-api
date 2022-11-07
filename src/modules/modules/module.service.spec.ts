import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from './module.service';

describe('ModulesService', () => {
  let service: ModulesService;

  const mockUsersRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: 'MODULE_REPOSITORY',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new module record and return that', async () => {
   
  });

  it('should return an unique module identified by its id', async () => {
   
  });
});
