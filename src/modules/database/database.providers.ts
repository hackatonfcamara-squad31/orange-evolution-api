import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        name: 'default',
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database:
          process.env.NODE_ENV === 'test'
            ? process.env.DB_TEST_DATABASE
            : process.env.DB_DATABASE,
        logging: ['error', 'log'],
        entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
        synchronize: true,
        ssl: false,
      });

      return dataSource.initialize();
    },
  },
];
