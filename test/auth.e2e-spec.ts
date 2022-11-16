import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { User } from '../src/modules/users/entities/user.entity';
import { UserModule } from '../src/modules/users/user.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  const defaultUser = {
    name: 'Peter Parker',
    email: 'peter2@email.com',
    password: 'testpassword123',
    is_admin: true,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthModule, UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
  });

  it('', async () => {
  });
});
