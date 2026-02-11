import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRaffleEntryDto } from './dto/create-raffle-entry.dto';
import { RaffleEntry } from './raffle-entry.entity';

@Injectable()
export class RaffleEntryService {
  constructor(
    @Inject('RAFFLE_ENTRY_REPOSITORY')
    private readonly raffleEntryRepo: Repository<RaffleEntry>,
  ) {}


  /**
   * Get all raffle entries
   * 
   * @returns {Promise<RaffleEntry[]>} An array of raffle entries
   */
  async findAll(): Promise<RaffleEntry[]> {
    return this.raffleEntryRepo.find();
  }

  /**
   * Create a new raffle entry
   * 
   * @param {CreateRaffleEntryDto} dto - The create raffle entry data transfer object
   *
   * @returns {Promise<RaffleEntry>} The created raffle entry
   */
  async create(dto: CreateRaffleEntryDto): Promise<RaffleEntry> {
    const entry = this.raffleEntryRepo.create({
      email: dto.email,
      name: dto.name,
    });

    return this.raffleEntryRepo.save(entry);
  }


  /**
   * Get a raffle entry by id
   *
   * @param id - The id of the raffle entry
   *
   * @returns {Promise<RaffleEntry | null>} The raffle entry or null if not found
   */
  async findOne(id: number): Promise<RaffleEntry | null> {
    return this.raffleEntryRepo.findOneBy({ id });
  }
}
