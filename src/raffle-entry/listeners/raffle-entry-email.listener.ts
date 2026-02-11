import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { RaffleEntryCreatedEvent } from '../events/raffle-entry-created.event';

@Injectable()
export class RaffleEntryEmailListener {
  constructor(private readonly mail: MailService) {}

  @OnEvent(RaffleEntryCreatedEvent.topic, { async: true })
  /**
   * Handle raffle entry created event
   *
   * @param event raffle entry created event
   */
  async handleEntryCreated(event: RaffleEntryCreatedEvent) {
    this.mail.send(
      event.email,
      'Raffle confirmation',
      `Hi ${event.name},\n\nThanks for entering the raffle!\n\nEntry ID: ${event.entryId}`,
      { entryId: event.entryId, type: 'confirmation' },
    );
  }
}
