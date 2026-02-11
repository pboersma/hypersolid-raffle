import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { RaffleResultProvider } from './raffle-result.provider';
import { RaffleResultService } from './raffle-result.service';
import { RaffleResultController } from './raffle-result.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [RaffleResultController],
  providers: [...RaffleResultProvider, RaffleResultService],
  exports: [RaffleResultService],
})
export class RaffleResultModule {}
