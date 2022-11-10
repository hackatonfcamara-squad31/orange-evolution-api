import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ContentModule } from 'src/modules/content/content.module';
import { Content } from 'src/modules/content/entities/content.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { CreateContentDTO } from 'src/modules/content/dto/create-content.dto';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Content>;

  const content: CreateContentDTO = {
    module_id: 5,
    creator_name: 'naruto',
    title: 'Learn Nest.js',
    link: 'www.youtube.com',
    type: 'video',
    duration: 86400,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ContentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = app.get<Repository<Content>>('CONTENT_REPOSITORY');
    repository.clear();
    await app.init();
  });

  afterAll(async () => {
    repository = app.get<Repository<Content>>('CONTENT_REPOSITORY');
    repository.clear();
  });

  it('/api/content (POST)', async () => {
    return request(app.getHttpServer())
      .post('/content')
      .send(content)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            ...content,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        );
      });
  });
});
