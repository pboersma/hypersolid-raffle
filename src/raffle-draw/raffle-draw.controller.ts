import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRaffleDrawForce } from '@src/common/decorators/api-raffle-draw.decorator';
import { RaffleDrawService } from './raffle-draw.service';

@ApiTags('raffle-draw')
@Controller('raffle-draw')
export class RaffleDrawController {
  constructor(private readonly raffleDrawService: RaffleDrawService) {}

  /**
   * Execute a forced raffle draw immediately
   *
   * @returns {Promise<{ message: string }>} Success message
   */
  @Post()
  @ApiRaffleDrawForce()
  async forceDraw(): Promise<{ message: string }> {
    await this.raffleDrawService.executeForcedDraw();
    
    return { message: 'Raffle draw executed successfully' };
  }
}
