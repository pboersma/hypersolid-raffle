import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaffleEntryService } from '@raffle-entry/raffle-entry.service';
import { RaffleEntry } from '@raffle-entry/raffle-entry.entity';
import { RaffleEntryCreatedEvent } from '@raffle-entry/events/raffle-entry-created.event';
import { CreateRaffleEntryDto } from '@raffle-entry/dto/create-raffle-entry.dto';

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

  describe('create', () => {
    it('should create entry and emit event', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const savedEntry = mockRaffleEntry();

      repo.create.mockReturnValue(savedEntry);
      repo.save.mockResolvedValue(savedEntry);

      const result = await service.create(dto);

      expect(result).toEqual(savedEntry);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        RaffleEntryCreatedEvent.topic,
        expect.any(RaffleEntryCreatedEvent),
      );
    });
  });
});
