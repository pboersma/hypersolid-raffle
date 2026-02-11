import { Controller, Get } from '@nestjs/common';

@Controller('raffle-entry')
export class RaffleEntryController {
  @Get()
  findAll(): string {
    return 'This action returns all raffle entries';
  }
}