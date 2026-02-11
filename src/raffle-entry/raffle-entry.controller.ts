import { Controller, Get, Post, Body, Param } from '@nestjs/common';

// Data Transfer Objects
import { CreateRaffleEntryDto } from './dto/create-raffle-entry.dto';
import { RaffleEntryResponseDto } from './dto/raffle-entry-response.dto';

// Service
import { RaffleEntryService } from './raffle-entry.service';

@Controller('raffle-entry')
export class RaffleEntryController {
  constructor(private readonly raffleEntryService: RaffleEntryService) {}

  @Get()
  /**
   * Get all raffle entries
   * 
   * @return An array of raffle entries
   */
  findAll(): Promise<RaffleEntryResponseDto[]> {
    return this.raffleEntryService.findAll();
  }


  @Get(':id')
  /**
   * Get a raffle entry by id
   *
   * @param id - The id of the raffle entry
   *
   * @return The raffle entry
   */
  findOne(@Param('id') id: string): Promise<RaffleEntryResponseDto | null> {
    return this.raffleEntryService.findOne(+id);
  }

  @Post()
  /**
   * Create a new raffle entry
   * 
   * @param dto - The create raffle entry data transfer object
   * 
   * @return The created raffle entry
   */
  create(@Body() dto: CreateRaffleEntryDto): Promise<RaffleEntryResponseDto> {
    return this.raffleEntryService.create(dto);
  }
}