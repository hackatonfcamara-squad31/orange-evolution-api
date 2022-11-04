import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsers: User[] = [
    {
      id: randomUUID(),
      name: 'John Doe',
      email: 'john@email.com',
      password: 'randomPassword123',
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: randomUUID(),
      name: 'Peter Parker',
      email: 'peter@email.com',
      password: 'thisIsMyPassword321',
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const mockUsersRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return that', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@email.com',
      password: 'testpassword123',
      is_admin: true,
    };

    mockUsersRepository.save.mockReturnValue({ id: randomUUID(), ...newUser });

    expect(await service.create(newUser)).toEqual({
      id: expect.any(String),
      password: expect.any(String),
      ...newUser,
    });

    expect(mockUsersRepository.create).toHaveBeenCalledWith({
      ...newUser,
      password: expect.any(String),
    });
  });

  it('should return an unique user identified by its email', async () => {
    const email = mockUsers[0].email;

    const user = mockUsers.filter((user) => user.email === email)[0];

    mockUsersRepository.findOne.mockReturnValue(user);

    expect(await service.findUserByEmail(email)).toEqual({
      ...user,
      password: expect.any(String),
    });

    expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
      where: { email },
    });
  });
});
