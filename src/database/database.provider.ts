import { DataSource } from 'typeorm';

/**
 * Database providers
 */
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'better-sqlite3',
        database: 'dev.sqlite',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];
