import { DataSource } from 'typeorm';
import { Completed } from './entities/completed.entity';

export const completedProvider = [
  {
    provide: 'COMPLETED_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Completed),
    inject: ['DATA_SOURCE'],
  },
];
