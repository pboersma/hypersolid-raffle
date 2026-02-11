import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaffleEntryService } from '../../src/raffle-entry/raffle-entry.service';
import { RaffleEntry } from '../../src/raffle-entry/raffle-entry.entity';
import { RaffleEntryCreatedEvent } from '../../src/raffle-entry/events/raffle-entry-created.event';
import { CreateRaffleEntryDto } from '../../src/raffle-entry/dto/create-raffle-entry.dto';

describe('RaffleEntryService', () => {
  let service: RaffleEntryService;
  let repo: jest.Mocked<Repository<RaffleEntry>>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockRaffleEntry = (): RaffleEntry => ({
    id: faker.number.int({ min: 1, max: 10000 }),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: faker.date.recent(),
  });

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<Repository<RaffleEntry>>> = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockEventEmitter: Partial<jest.Mocked<EventEmitter2>> = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleEntryService,
        {
          provide: 'RAFFLE_ENTRY_REPOSITORY',
          useValue: mockRepo,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<RaffleEntryService>(RaffleEntryService);
    repo = module.get('RAFFLE_ENTRY_REPOSITORY');
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of raffle entries', async () => {
      const entries = [mockRaffleEntry(), mockRaffleEntry(), mockRaffleEntry()];
      repo.find.mockResolvedValue(entries);

      const result = await service.findAll();

      expect(result).toEqual(entries);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no entries exist', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single raffle entry by id', async () => {
      const entry = mockRaffleEntry();
      repo.findOneBy.mockResolvedValue(entry);

      const result = await service.findOne(entry.id);

      expect(result).toEqual(entry);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: entry.id });
    });

    it('should return null when entry is not found', async () => {
      const id = faker.number.int({ min: 1, max: 10000 });
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(result).toBeNull();
      expect(repo.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('create', () => {
    it('should create and return a new raffle entry', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const createdEntry = mockRaffleEntry();
      const savedEntry: RaffleEntry = {
        ...createdEntry,
        email: dto.email,
        name: dto.name,
      };

      repo.create.mockReturnValue(savedEntry);
      repo.save.mockResolvedValue(savedEntry);

      const result = await service.create(dto);

      expect(result).toEqual(savedEntry);
      expect(repo.create).toHaveBeenCalledWith({
        email: dto.email,
        name: dto.name,
      });
      expect(repo.save).toHaveBeenCalledWith(savedEntry);
    });

    it('should emit a RaffleEntryCreatedEvent after creation', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const savedEntry: RaffleEntry = {
        id: faker.number.int({ min: 1, max: 10000 }),
        email: dto.email,
        name: dto.name,
        createdAt: faker.date.recent(),
      };

      repo.create.mockReturnValue(savedEntry);
      repo.save.mockResolvedValue(savedEntry);

      await service.create(dto);

      expect(eventEmitter.emit).toHaveBeenCalledTimes(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        RaffleEntryCreatedEvent.topic,
        expect.any(RaffleEntryCreatedEvent),
      );

      const emittedEvent = eventEmitter.emit.mock
        .calls[0][1] as RaffleEntryCreatedEvent;
      expect(emittedEvent.entryId).toBe(savedEntry.id);
      expect(emittedEvent.email).toBe(savedEntry.email);
      expect(emittedEvent.name).toBe(savedEntry.name);
      expect(emittedEvent.createdAt).toBe(savedEntry.createdAt);
    });

    it('should propagate repository errors', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };

      repo.create.mockReturnValue({} as RaffleEntry);
      repo.save.mockRejectedValue(new Error('UNIQUE constraint failed'));

      await expect(service.create(dto)).rejects.toThrow(
        'UNIQUE constraint failed',
      );
      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
