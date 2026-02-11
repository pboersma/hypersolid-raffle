import { DataSource } from 'typeorm';
import { RaffleEntry } from './raffle-entry.entity';

export const RaffleEntryProvider = [
  {
    provide: 'RAFFLE_ENTRY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RaffleEntry),
    inject: ['DATA_SOURCE'],
  },
];
