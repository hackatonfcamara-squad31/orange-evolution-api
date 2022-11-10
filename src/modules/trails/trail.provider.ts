import { DataSource } from 'typeorm';
import { Trail } from './entities/trail.entity';

export const trailProvider = [
  {
    provide: 'TRAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Trail),
    inject: ['DATA_SOURCE'],
  },
];
