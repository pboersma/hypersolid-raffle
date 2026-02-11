import { Module } from '@nestjs/common';
import { RaffleEntryController } from './raffle-entry.controller';

@Module({
  controllers: [RaffleEntryController],
})

export class RaffleEntryModule {}