import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { RaffleEntryCreatedEvent } from '../events/raffle-entry-created.event';

@Injectable()
export class RaffleEntryEmailListener {
    constructor(private readonly mail: MailService) { }

    /**
     * Handle raffle entry created event
     *
     * @param {RaffleEntryCreatedEvent} event - Raffle entry created event
     *
     * @returns {Promise<void>}
     */
    @OnEvent(RaffleEntryCreatedEvent.topic, { async: true })
    async handleEntryCreated(event: RaffleEntryCreatedEvent): Promise<void> {
        this.mail.send(
            event.email,
            'Raffle confirmation',
            `Hi ${event.name},\n\nThanks for entering the raffle!\n\nEntry ID: ${event.entryId}`,
            { entryId: event.entryId, type: 'confirmation' },
        );
    }
}
