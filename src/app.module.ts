import { Module } from '@nestjs/common';

// Main Modules
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Custom Modules
import { DatabaseModule } from './database/database.module';
import { RaffleEntryModule } from './raffle-entry/raffle-entry.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RaffleEntryModule,
  ],
})
export class AppModule {}
