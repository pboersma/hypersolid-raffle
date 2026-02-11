import { Module } from '@nestjs/common';

// Modules
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RaffleEntryModule } from './raffle-entry/raffle-entry.module';

@Module({
  imports: [
    DatabaseModule,
    EventEmitterModule.forRoot(),
    RaffleEntryModule,
  ],
})
export class AppModule {}
