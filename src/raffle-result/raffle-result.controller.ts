import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiRaffleResultFindAll,
  ApiRaffleResultFindLatest,
} from '@src/common/decorators/api-raffle-result.decorator';
import { RaffleResultService } from './raffle-result.service';
import { RaffleResult } from './raffle-result.entity';

@ApiTags('raffle-result')
@Controller('raffle-result')
export class RaffleResultController {
  constructor(private readonly raffleResultService: RaffleResultService) {}

  /**
   * Get all raffle results
   *
   * @returns Promise<RaffleResult[]> Array of raffle results ordered by draw date
   */
  @Get()
  @ApiRaffleResultFindAll()
  async findAll(): Promise<RaffleResult[]> {
    return this.raffleResultService.findAll();
  }

  /**
   * Get the latest raffle result
   *
   * @returns Promise<RaffleResult | null> The most recent raffle result or null
   */
  @Get('latest')
  @ApiRaffleResultFindLatest()
  async findLatest(): Promise<RaffleResult | null> {
    return this.raffleResultService.findLatest();
  }
}
