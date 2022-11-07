import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateModuleDTO } from './dtos/create-module.dto';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';

describe('ModulesController', () => {
  let controller: ModulesController;

  const mockUsersService = {
    create: jest.fn().mockImplementation((dto: CreateModuleDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [ModulesService],
    })
      .overrideProvider(ModulesService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<ModulesController>(ModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new module', async () => {
  
  });
});
