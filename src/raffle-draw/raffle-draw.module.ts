import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { RaffleEntryProvider } from '../raffle-entry/raffle-entry.provider';
import { RaffleDrawService } from './raffle-draw.service';
import { RaffleDrawController } from './raffle-draw.controller';
import { RaffleDrawListener } from './listeners/raffle-draw.listener';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [RaffleDrawController],
  providers: [...RaffleEntryProvider, RaffleDrawService, RaffleDrawListener],
})

export class RaffleDrawModule {}
