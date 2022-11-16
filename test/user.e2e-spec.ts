import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../src/modules/users/entities/user.entity';
import { UserModule } from '../src/modules/users/user.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  const defaultUser = {
    name: 'Peter Parker',
    email: 'peter@email.com',
    password: 'testpassword123',
    is_admin: true,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
  });

  it('', async () => {
  });
});
