import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import 'dotenv/config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { AuthService } from './auth.service';
import { UserPayload } from './dtos/UserPayload';

describe('AuthService', () => {
  let service: AuthService;
  const jwtService = new JwtService;

  const mockUser: User = {
    id: randomUUID(),
    name: 'John Doe',
    email: 'john@email.com',
    password: 'randomPassword123',
    is_admin: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUsersService = {
    findUserByEmail: jest.fn().mockImplementation((email: string) => {
      return mockUser;
    }),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockImplementation((email: string, password: string) => {
      if (password === mockUser.password) {
        return {
          ...mockUser,
          password: undefined
        };
      }
    }),
    login: jest.fn().mockImplementation((user: User) => {
      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
      };

      return {
        access_token: jwtService.sign(payload, { secret: process.env.JWT_SECRET }),
      };
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    }).overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate the user and return a jwt token', async () => {
    expect(await service.login(mockUser)).toEqual({
      access_token: expect.any(String),
    });
  });

  it('should validate user authentication and return', async () => {
    expect(
      await service.validateUser(mockUser.email, mockUser.password),
    ).toEqual({
      ...mockUser,
      password: undefined,
    });
  });
});
