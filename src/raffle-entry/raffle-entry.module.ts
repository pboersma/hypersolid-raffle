import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RaffleEntryController } from './raffle-entry.controller';
import { RaffleEntryService } from './raffle-entry.service';
import { RaffleEntryProvider } from './raffle-entry.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [RaffleEntryController],
  providers: [
    ...RaffleEntryProvider,
    RaffleEntryService,
  ],
  exports: [RaffleEntryService],
})

export class RaffleEntryModule {}
