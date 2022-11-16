import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn().mockImplementation((dto: CreateUserDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = await controller.create({
      name: 'John Doe',
      email: 'john@email.com',
      password: 'testpassword123',
      is_admin: true,
    });

    expect(user).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      avatar: expect.any(String),
      email: 'john@email.com',
      password: expect.any(String),
      is_admin: true,
    });

    expect(mockUsersService.create).toHaveBeenCalled();
  });
});
