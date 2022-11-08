import { DataSource } from 'typeorm';
import { Content } from './entities/content.entity';

export const contentProvider = [
  {
    provide: 'CONTENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Content),
    inject: ['DATA_SOURCE'],
  },
];
