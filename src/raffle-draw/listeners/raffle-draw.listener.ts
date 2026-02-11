import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { RaffleResultService } from '../../raffle-result/raffle-result.service';
import { WinnerSelectedEvent } from '../events/winner-selected.event';
import { NonWinnersSelectedEvent } from '../events/non-winners-selected.event';
import { RaffleDrawExecutedEvent } from '../events/raffle-draw-executed.event';

@Injectable()
export class RaffleDrawListener {
    private readonly logger = new Logger(RaffleDrawListener.name);

    constructor(
        private readonly mailService: MailService,
        private readonly raffleResultService: RaffleResultService,
    ) { }

    /**
     * Handle winner selected event
     *
     * @param {WinnerSelectedEvent} event - Winner selected event
     *
     * @returns {Promise<void>}
     */
    @OnEvent(WinnerSelectedEvent.topic, { async: true })
    async handleWinnerSelected(event: WinnerSelectedEvent): Promise<void> {
        this.mailService.send(
            event.email,
            'Congratulations! You won the raffle!',
            `Hi ${event.name},\n\nCongratulations! You have been selected as the winner of this week's raffle!\n\nYour entry ID: ${event.entryId}\n\nThank you for participating!`,
            { entryId: event.entryId, type: 'winner' },
        );
    }

    /**
     * Handle non-winners selected event
     *
     * @param {NonWinnersSelectedEvent} event - Non-winners selected event
     *
     * @returns {Promise<void>}
     */
    @OnEvent(NonWinnersSelectedEvent.topic, { async: true })
    async handleNonWinnersSelected(event: NonWinnersSelectedEvent): Promise<void> {
        for (const entry of event.nonWinners) {
            this.mailService.send(
                entry.email,
                'Raffle results',
                `Hi ${entry.name},\n\nThank you for participating in this week's raffle. Unfortunately, you were not selected as the winner this time.\n\nYour entry ID: ${entry.id}\n\nPlease try again next week!`,
                { entryId: entry.id, type: 'non-winner' },
            );
        }
    }

    /**
     * Handle raffle draw executed event - logs and saves result
     *
     * @param {RaffleDrawExecutedEvent} event - Raffle draw executed event
     *
     * @returns {Promise<void>}
     */
    @OnEvent(RaffleDrawExecutedEvent.topic)
    async handleRaffleDrawExecuted(event: RaffleDrawExecutedEvent): Promise<void> {
        this.logger.log(
            `Raffle completed. Winner: ${event.winnerName} (${event.winnerEmail}) from ${event.totalEntries} entries`,
        );

        await this.raffleResultService.saveResult(
            event.winnerId,
            event.winnerEmail,
            event.winnerName,
            event.totalEntries,
        );
    }
}
