import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ContentModule } from '../src/modules/content/content.module';
import { Content } from '../src/modules/content/entities/content.entity';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { CreateContentDTO } from '../src/modules/content/dto/create-content.dto';

describe('ContentController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Content>;

  const content: CreateContentDTO = {
    module_id: '',
    creator_name: 'naruto',
    title: 'Learn Nest.js',
    link: 'www.youtube.com',
    type: 'video',
    duration: 86400,
    order: 1
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), ContentModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
  });

  it('', async () => {
  });
});
