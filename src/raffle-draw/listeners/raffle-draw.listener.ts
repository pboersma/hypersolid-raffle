import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../../mail/mail.service';
import { WinnerSelectedEvent } from '../events/winner-selected.event';
import { NonWinnersSelectedEvent } from '../events/non-winners-selected.event';
import { RaffleDrawExecutedEvent } from '../events/raffle-draw-executed.event';

@Injectable()
export class RaffleDrawListener {
  private readonly logger = new Logger(RaffleDrawListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent(WinnerSelectedEvent.topic, { async: true })
  /**
   * Handle winner selected event
   *
   * @param event winner selected event
   */
  async handleWinnerSelected(event: WinnerSelectedEvent) {
    this.mailService.send(
      event.email,
      'Congratulations! You won the raffle!',
      `Hi ${event.name},\n\nCongratulations! You have been selected as the winner of this week's raffle!\n\nYour entry ID: ${event.entryId}\n\nThank you for participating!`,
      { entryId: event.entryId, type: 'winner' },
    );
  }

  @OnEvent(NonWinnersSelectedEvent.topic, { async: true })
  /**
   * Handle non-winners selected event
   *
   * @param event non-winners selected event
   */
  async handleNonWinnersSelected(event: NonWinnersSelectedEvent) {
    for (const entry of event.nonWinners) {
      this.mailService.send(
        entry.email,
        'Raffle results',
        `Hi ${entry.name},\n\nThank you for participating in this week's raffle. Unfortunately, you were not selected as the winner this time.\n\nYour entry ID: ${entry.id}\n\nPlease try again next week!`,
        { entryId: entry.id, type: 'non-winner' },
      );
    }
  }

  @OnEvent(RaffleDrawExecutedEvent.topic)
  /**
   * Handle raffle draw executed event
   *
   * @param event raffle draw executed event
   */
  handleRaffleDrawExecuted(event: RaffleDrawExecutedEvent) {
    this.logger.log(
      `Raffle completed. Winner: ${event.winnerName} (${event.winnerEmail}) from ${event.totalEntries} entries`,
    );
  }
}
