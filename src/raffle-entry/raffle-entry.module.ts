import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MailModule } from '../mail/mail.module';
import { RaffleEntryProvider } from './raffle-entry.provider';
import { RaffleEntryService } from './raffle-entry.service';
import { RaffleEntryEmailListener } from './listeners/raffle-entry-email.listener';
import { RaffleEntryController } from './raffle-entry.controller';

@Module({
  imports: [DatabaseModule, MailModule],
  controllers: [RaffleEntryController],
  providers: [
    ...RaffleEntryProvider,
    RaffleEntryService,
    RaffleEntryEmailListener,
  ],
  exports: [RaffleEntryService],
})
export class RaffleEntryModule {}
