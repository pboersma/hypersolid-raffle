import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { CreateRaffleEntryDto } from './dto/create-raffle-entry.dto';
import { RaffleEntry } from './raffle-entry.entity';
import { RaffleEntryCreatedEvent } from './events/raffle-entry-created.event';

@Injectable()
export class RaffleEntryService {
  constructor(
    @Inject('RAFFLE_ENTRY_REPOSITORY')
    private readonly raffleEntryRepo: Repository<RaffleEntry>,
    private readonly eventEmitter: EventEmitter2,
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

    const saved = await this.raffleEntryRepo.save(entry);

    this.eventEmitter.emit(
      RaffleEntryCreatedEvent.topic,
      new RaffleEntryCreatedEvent(
        saved.id,
        saved.email,
        saved.name,
        saved.createdAt,
      ),
    );

    return saved;
  }

  /**
   * Get a raffle entry by id
   *
   * @param {number} id - The id of the raffle entry
   *
   * @returns {Promise<RaffleEntry | null>} The raffle entry or null if not found
   */
  async findOne(id: number): Promise<RaffleEntry | null> {
    return this.raffleEntryRepo.findOneBy({ id });
  }

  /**
   * Update a raffle entry
   *
   * @param {number} id - The id of the raffle entry
   * @param {CreateRaffleEntryDto} dto - The update raffle entry data transfer object
   *
   * @returns {Promise<RaffleEntry | null>} The updated raffle entry or null if not found
   */
  async update(
    id: number,
    dto: CreateRaffleEntryDto,
  ): Promise<RaffleEntry | null> {
    const entry = await this.raffleEntryRepo.preload({
      id,
      email: dto.email,
      name: dto.name,
    });

    if (!entry) {
      return null;
    }

    return this.raffleEntryRepo.save(entry);
  }

  /**
   * Delete a raffle entry
   *
   * @param {number} id - The id of the raffle entry to delete
   *
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.raffleEntryRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
