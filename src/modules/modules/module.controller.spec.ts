import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateModuleDTO } from './dtos/create-module.dto';
import { UpdateModuleDTO } from './dtos/update-module.dto';
import { ModulesController } from './module.controller';
import { ModulesService } from './module.service';

describe('ModulesController', () => {
  let controller: ModulesController;

  const mockModulesService = {
    create: jest.fn().mockImplementation((dto: CreateModuleDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
    update: jest.fn().mockImplementation((dto: UpdateModuleDTO) => {
      return {
        ...dto,
      };
    }),
    reorder: jest.fn().mockImplementation(),
    delete: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulesController],
      providers: [ModulesService],
    })
      .overrideProvider(ModulesService)
      .useValue(mockModulesService)
      .compile();

    controller = module.get<ModulesController>(ModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new module', async () => {
    const module = await controller.create({
      title: 'Programming Basics',
      order: 1,
    });

    expect(module).toEqual({
      id: expect.any(String),
      title: 'Programming Basics',
      order: 1,
      icon: '',
    });

    expect(mockModulesService.create).toHaveBeenCalled();
  });

  it('should return an error if creating another module in same position', async () => {
    await controller.create({
      title: 'Programming Basics',
      order: 1,
    });

    mockModulesService.create.mockReturnValue({
      statusCode: 400,
      message:
        'Já existe um módulo nessa posição. Você precisa reordenar os módulos.',
      error: 'Bad Request',
    });

    const module = await controller.create({
      title: 'Programming Intermediate',
      order: 1,
    });

    expect(module).toEqual({
      statusCode: 400,
      message:
        'Já existe um módulo nessa posição. Você precisa reordenar os módulos.',
      error: 'Bad Request',
    });

    expect(mockModulesService.create).toHaveBeenCalled();
  });

  it('should update an existing module', async () => {
    const module = await controller.create({
      title: 'Programming Bacs',
      order: 1,
    });

    const updatedModule = await controller.update(module.id, {
      title: 'Programming Basics',
    });

    expect(updatedModule).toEqual({
      id: module.id,
      title: 'Programming Basics',
    });

    expect(mockModulesService.update).toHaveBeenCalled();
  });

  it('should  delete an existing module', async () => {
    const module = await controller.create({
      title: 'Programming Basics',
      order: 1,
    });

    await controller.delete(module.id);

    expect(mockModulesService.delete).toHaveBeenCalled();
  });

  it('should  reorder the existing modules', async () => {
    await controller.create({
      title: 'Programming Basics',
      order: 1,
    });

    const module = await controller.create({
      title: 'Programming Intermediate',
      order: 2,
    });

    await controller.reorder({ id: module.id, order: 1 });

    expect(mockModulesService.reorder).toHaveBeenCalled();
  });
});
