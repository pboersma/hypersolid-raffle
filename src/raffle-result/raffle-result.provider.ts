import { DataSource } from 'typeorm';
import { RaffleResult } from './raffle-result.entity';

export const RaffleResultProvider = [
  {
    provide: 'RAFFLE_RESULT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RaffleResult),
    inject: ['DATA_SOURCE'],
  },
];
