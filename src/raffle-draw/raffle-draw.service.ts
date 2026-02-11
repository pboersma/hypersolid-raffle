import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository, Between } from 'typeorm';
import { RaffleEntry } from '../raffle-entry/raffle-entry.entity';
import { WinnerSelectedEvent } from './events/winner-selected.event';
import { NonWinnersSelectedEvent } from './events/non-winners-selected.event';
import { RaffleDrawExecutedEvent } from './events/raffle-draw-executed.event';

@Injectable()
export class RaffleDrawService {
  private readonly logger = new Logger(RaffleDrawService.name);

  constructor(
    @Inject('RAFFLE_ENTRY_REPOSITORY')
    private readonly raffleEntryRepo: Repository<RaffleEntry>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Execute the raffle every Monday at 1 PM
   * Selects 1 winner at random from all entries of the previous week
   *
   * @returns {Promise<void>}
   */
  @Cron('0 13 * * 1')
  async executeRaffle(): Promise<void> {
    this.logger.log('Starting weekly raffle execution');

    await this.runDraw(false);
  }

  /**
   * Execute a forced raffle draw from all entries
   *
   * @returns {Promise<void>}
   */
  async executeForcedDraw(): Promise<void> {
    this.logger.log('Starting forced raffle draw');

    await this.runDraw(true);
  }

  /**
   * Run the draw logic
   *
   * @param {boolean} allEntries - If true, draw from all entries. If false, only from last week.
   *
   * @returns {Promise<void>}
   */
  private async runDraw(allEntries: boolean): Promise<void> {
    const entries = allEntries
      ? await this.getAllEntries()
      : await this.getEntriesFromLastWeek();

    if (entries.length === 0) {
      this.logger.log('No entries found for draw');
      return;
    }

    this.logger.log(`Found ${entries.length} entries for draw`);

    const winner = this.selectWinner(entries);
    const nonWinners = entries.filter((entry) => entry.id !== winner.id);

    this.eventEmitter.emit(
      WinnerSelectedEvent.topic,
      new WinnerSelectedEvent(winner.id, winner.email, winner.name),
    );

    this.eventEmitter.emit(
      NonWinnersSelectedEvent.topic,
      new NonWinnersSelectedEvent(nonWinners),
    );

    this.eventEmitter.emit(
      RaffleDrawExecutedEvent.topic,
      new RaffleDrawExecutedEvent(
        winner.id,
        winner.email,
        winner.name,
        entries.length,
        new Date(),
      ),
    );
  }

  /**
   * Get all entries
   *
   * @returns {Promise<RaffleEntry[]>}
   */
  private async getAllEntries(): Promise<RaffleEntry[]> {
    return this.raffleEntryRepo.find();
  }

  /**
   * Get all entries from the previous week (Monday to Sunday)
   *
   * @returns {Promise<RaffleEntry[]>}
   */
  private async getEntriesFromLastWeek(): Promise<RaffleEntry[]> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - daysSinceMonday - 7);
    lastMonday.setHours(0, 0, 0, 0);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);
    lastSunday.setHours(23, 59, 59, 999);

    return this.raffleEntryRepo.find({
      where: {
        createdAt: Between(lastMonday, lastSunday),
      },
    });
  }

  /**
   * Select a random winner from the entries
   *
   * @param {RaffleEntry[]} entries - Raffle entries
   *
   * @returns {RaffleEntry}
   */
  private selectWinner(entries: RaffleEntry[]): RaffleEntry {
    const randomIndex = Math.floor(Math.random() * entries.length);

    return entries[randomIndex];
  }
}
