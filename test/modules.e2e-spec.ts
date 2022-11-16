import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Module } from '../src/modules/modules/entities/module.entity';
import { ModulesModule } from '../src/modules/modules/module.module';

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
    await app.init();
  });

  afterAll(async () => {
  });

  it('', async () => {
  });
})