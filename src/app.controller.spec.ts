import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Completed } from './modules/content-completed/entities/completed.entity';
import { StorageModule } from './modules/storage/storage.module';
import { UsersService } from './modules/users/user.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getPing: jest.fn().mockImplementation(() => {
      return 'OK';
    }),
  };

  const mockUsersRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUsersRepository,
        },
      ],
      imports: [StorageModule]
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('root', () => {
    it('should return "OK"', () => {
      const response = appController.getPing();
      expect(response).toBe('OK');

      expect(mockAppService.getPing).toHaveBeenCalled();
    });
  });

  const currentUser = {
    id: randomUUID(),
    name: 'John Doe',
    email: 'john@email.com',
    password: 'testpassword123',
    avatar: '',
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
    completed: [new Completed()],
  };

  describe('/me', () => {
    it('should return the current logged user', async () => {
      mockUsersRepository.findOne.mockReturnValue(currentUser)

      const response = await appController.getMe(currentUser);

      expect(response).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'John Doe',
          email: 'john@email.com',
          avatar: '',
          is_admin: true,
        }),
      );
    });
  });
});
