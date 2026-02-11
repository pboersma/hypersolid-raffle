import { Module } from '@nestjs/common';

// Main Modules
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Custom Modules
import { DatabaseModule } from './database/database.module';
import { RaffleEntryModule } from './raffle-entry/raffle-entry.module';
import { RaffleDrawModule } from './raffle-draw/raffle-draw.module';
import { RaffleResultModule } from './raffle-result/raffle-result.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    RaffleEntryModule,
    RaffleDrawModule,
    RaffleResultModule,
  ],
})
export class AppModule {}
