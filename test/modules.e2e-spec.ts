import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Module } from 'src/modules/modules/entities/module.entity';
import { ModulesModule } from '../src/modules/modules/module.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe('ModuleController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Module>;

  const defaultModule = {
    title: 'Programming Basics',
    order: 1,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ModulesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = app.get<Repository<Module>>('MODULE_REPOSITORY');
    repository.clear();
    await app.init();
  });

  afterAll(async () => {
    repository = app.get<Repository<Module>>('MODULE_REPOSITORY');
    repository.clear();
  });

  it('/api/modules (POST)', async () => {
    return request(app.getHttpServer())
      .post('/modules')
      .send(defaultModule)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            ...defaultModule,
          }),
        );
      });
  });

  it('/api/modules (PUT)', async () => {
    let createdModule;

    await request(app.getHttpServer())
      .post('/modules')
      .send(defaultModule)
      .expect(201)
      .then((response) => {
        createdModule = response.body;
      });

    return request(app.getHttpServer())
      .put(`/modules/${createdModule.id}`)
      .send({ title: 'Programming Basics Part 1' })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            title: 'Programming Basics Part 1',
            order: 1,
            icon_url: expect.any(String),
          }),
        );
      });
  });

  it('/api/modules reorder (PUT)', async () => {
    let createdModule;

    await request(app.getHttpServer())
      .post('/modules')
      .send(defaultModule)
      .expect(201)
      .then((response) => {
        createdModule = response.body;
      });

    await request(app.getHttpServer())
      .post('/modules')
      .send({ ...defaultModule, order: 2 })
      .expect(201);

    return request(app.getHttpServer())
      .put('/modules')
      .send({
        id: createdModule.id,
        order: 2,
      })
      .expect(200);
  });
});
