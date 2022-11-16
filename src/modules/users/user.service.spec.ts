import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Completed } from '../content-completed/entities/completed.entity';
import { StorageModule } from '../storage/storage.module';
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
      avatar: '',
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date(),
      completed: [new Completed()],
    },
    {
      id: randomUUID(),
      name: 'Peter Parker',
      email: 'peter@email.com',
      password: 'thisIsMyPassword321',
      avatar: '',
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
      completed: [new Completed()],
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
      imports: [StorageModule]
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
      name: newUser.name,
      email: newUser.email,
      is_admin: newUser.is_admin,
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

  it('should throw an error when not passing a uuid to findUserById', () => {
    const id = 'asdf';
    expect(service.findUserById(id)).rejects.toThrow(BadRequestException);
  });

  it("should throw an error when passing an id of a User that doesn't exists", async () => {
    const id = randomUUID();
    let user: User;
    mockUsersRepository.findOne.mockReturnValue(user);
    await expect(() => service.findUserById(id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return an user given an id', async () => {
    mockUsersRepository.findOne.mockReturnValue(mockUsers[0]);
    expect(await service.findUserById(mockUsers[0].id)).toEqual(mockUsers[0]);
  });
});
