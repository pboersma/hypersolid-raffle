import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RaffleEntryModule } from './raffle-entry/raffle-entry.module';

@Module({
  imports: [
    DatabaseModule,
    RaffleEntryModule,
  ],
})
export class AppModule {}
