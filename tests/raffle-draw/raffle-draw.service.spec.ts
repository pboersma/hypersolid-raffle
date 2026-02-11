import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaffleDrawService } from '@raffle-draw/raffle-draw.service';
import { RaffleEntry } from '@raffle-entry/raffle-entry.entity';
import { WinnerSelectedEvent } from '@raffle-draw/events/winner-selected.event';

describe('RaffleDrawService', () => {
  let service: RaffleDrawService;
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
    };

    const mockEventEmitter: Partial<jest.Mocked<EventEmitter2>> = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleDrawService,
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

    service = module.get<RaffleDrawService>(RaffleDrawService);
    repo = module.get('RAFFLE_ENTRY_REPOSITORY');
    eventEmitter = module.get(EventEmitter2);
  });

  describe('executeForcedDraw', () => {
    it('should select a winner from entries', async () => {
      const entries = [mockRaffleEntry(), mockRaffleEntry()];
      repo.find.mockResolvedValue(entries);

      await service.executeForcedDraw();

      const winnerCall = eventEmitter.emit.mock.calls.find(
        (call) => call[0] === WinnerSelectedEvent.topic,
      );
      expect(winnerCall).toBeDefined();
      expect(entries.map((e) => e.id)).toContain((winnerCall![1] as WinnerSelectedEvent).entryId);
    });

    it('should not emit events when no entries exist', async () => {
      repo.find.mockResolvedValue([]);

      await service.executeForcedDraw();

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });
});
