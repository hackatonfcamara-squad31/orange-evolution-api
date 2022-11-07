import { DataSource } from 'typeorm';
import { Module } from './entities/module.entity';

export const moduleProvider = [
  {
    provide: 'MODULE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Module),
    inject: ['DATA_SOURCE'],
  },
];
