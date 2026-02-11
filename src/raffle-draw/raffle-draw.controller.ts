import { Controller, Post } from '@nestjs/common';
import { RaffleDrawService } from './raffle-draw.service';

@Controller('raffle-draw')
export class RaffleDrawController {
  constructor(private readonly raffleDrawService: RaffleDrawService) {}

  @Post()
  /**
   * Force execute the raffle draw immediately
   *
   * @return Success message
   */
  async forceDraw(): Promise<{ message: string }> {
    await this.raffleDrawService.executeForcedDraw();
    return { message: 'Raffle draw executed successfully' };
  }
}
