import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { Completed } from '../content-completed/entities/completed.entity';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './dtos/AuthRequest';
import { UserPayload } from './dtos/UserPayload';

describe('AuthController', () => {
  let controller: AuthController;
  const jwtService = new JwtService();

  const mockUser: User = {
    id: randomUUID(),
    name: 'John Doe',
    email: 'john@email.com',
    password: 'randomPassword123',
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
    completed: [new Completed()],
  };

  const mockAuthService = {
    login: jest.fn().mockImplementation((user: User) => {
      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        access_token: jwtService.sign(payload, {
          secret: process.env.JWT_SECRET,
        }),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should authenticate the user and return a jwt token', async () => {
    const response = await controller.login({ user: mockUser } as AuthRequest);

    expect(response).toEqual({
      access_token: expect.any(String),
    });

    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
