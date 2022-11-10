import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Completed } from './modules/content-completed/entities/completed.entity';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getPing: jest.fn().mockImplementation(() => {
      return 'OK';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
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
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
    completed: [new Completed()],
  };

  describe('/me', () => {
    it('should return the current logged user', () => {
      const response = appController.getMe(currentUser);

      expect(response).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: 'John Doe',
          email: 'john@email.com',
        }),
      );
    });
  });
});
