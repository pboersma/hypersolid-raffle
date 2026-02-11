import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RaffleResult } from './raffle-result.entity';

@Injectable()
export class RaffleResultService {
  constructor(
    @Inject('RAFFLE_RESULT_REPOSITORY')
    private readonly raffleResultRepo: Repository<RaffleResult>,
  ) {}

  /**
   * Save a raffle result
   *
   * @param winnerId - The id of the winner
   * @param winnerEmail - The email of the winner
   * @param winnerName - The name of the winner
   * @param totalEntries - Total number of entries in the draw
   * @returns The saved raffle result
   */
  async saveResult(
    winnerId: number,
    winnerEmail: string,
    winnerName: string,
    totalEntries: number,
  ): Promise<RaffleResult> {
    const result = this.raffleResultRepo.create({
      winnerId,
      winnerEmail,
      winnerName,
      totalEntries,
    });

    return this.raffleResultRepo.save(result);
  }

  /**
   * Get all raffle results ordered by draw date (newest first)
   *
   * @returns Array of raffle results
   */
  async findAll(): Promise<RaffleResult[]> {
    return this.raffleResultRepo.find({
      order: { drawnAt: 'DESC' },
    });
  }

  /**
   * Get the most recent raffle result
   *
   * @returns The most recent raffle result or null
   */
  async findLatest(): Promise<RaffleResult | null> {
    return this.raffleResultRepo.findOne({
      order: { drawnAt: 'DESC' },
    });
  }
}
