import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository, Between } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RaffleDrawService } from '@raffle-draw/raffle-draw.service';
import { RaffleEntry } from '@raffle-entry/raffle-entry.entity';
import { WinnerSelectedEvent } from '@raffle-draw/events/winner-selected.event';
import { NonWinnersSelectedEvent } from '@raffle-draw/events/non-winners-selected.event';
import { RaffleDrawExecutedEvent } from '@raffle-draw/events/raffle-draw-executed.event';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeForcedDraw', () => {
    it('should emit events when entries exist', async () => {
      const entries = [mockRaffleEntry(), mockRaffleEntry(), mockRaffleEntry()];
      repo.find.mockResolvedValue(entries);

      await service.executeForcedDraw();

      expect(eventEmitter.emit).toHaveBeenCalledTimes(3);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        WinnerSelectedEvent.topic,
        expect.any(WinnerSelectedEvent),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        NonWinnersSelectedEvent.topic,
        expect.any(NonWinnersSelectedEvent),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        RaffleDrawExecutedEvent.topic,
        expect.any(RaffleDrawExecutedEvent),
      );
    });

    it('should not emit events when no entries exist', async () => {
      repo.find.mockResolvedValue([]);

      await service.executeForcedDraw();

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });

    it('should select one winner from all entries', async () => {
      const entries = [mockRaffleEntry(), mockRaffleEntry(), mockRaffleEntry()];
      repo.find.mockResolvedValue(entries);

      await service.executeForcedDraw();

      const winnerEvent = eventEmitter.emit.mock.calls.find(
        (call) => call[0] === WinnerSelectedEvent.topic,
      )?.[1] as WinnerSelectedEvent;

      expect(winnerEvent).toBeDefined();
      expect(entries.map((e) => e.id)).toContain(winnerEvent.entryId);
    });
  });
});
