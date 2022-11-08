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
    repository = app.get<Repository<User>>('USER_REPOSITORY');
    repository.clear();
    await app.init();
  });

  afterAll(async () => {
    repository = app.get<Repository<User>>('USER_REPOSITORY');
    repository.clear();
  });

  it('/api/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(defaultUser)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            ...defaultUser,
            password: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });

    return request(app.getHttpServer())
      .post('/login')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            access_token: expect.any(String),
          }),
        );
      });
  });
});
