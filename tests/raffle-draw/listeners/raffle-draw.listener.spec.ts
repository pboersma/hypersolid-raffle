import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleDrawListener } from '@raffle-draw/listeners/raffle-draw.listener';
import { MailService } from '@mail/mail.service';
import { RaffleResultService } from '@raffle-result/raffle-result.service';
import { WinnerSelectedEvent } from '@raffle-draw/events/winner-selected.event';
import { NonWinnersSelectedEvent } from '@raffle-draw/events/non-winners-selected.event';
import { RaffleDrawExecutedEvent } from '@raffle-draw/events/raffle-draw-executed.event';
import { RaffleEntry } from '@raffle-entry/raffle-entry.entity';

describe('RaffleDrawListener', () => {
  let listener: RaffleDrawListener;
  let mailService: jest.Mocked<MailService>;
  let raffleResultService: jest.Mocked<RaffleResultService>;

  beforeEach(async () => {
    const mockMailService: Partial<jest.Mocked<MailService>> = {
      send: jest.fn(),
    };

    const mockRaffleResultService: Partial<jest.Mocked<RaffleResultService>> = {
      saveResult: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleDrawListener,
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: RaffleResultService,
          useValue: mockRaffleResultService,
        },
      ],
    }).compile();

    listener = module.get<RaffleDrawListener>(RaffleDrawListener);
    mailService = module.get(MailService);
    raffleResultService = module.get(RaffleResultService);
  });

  describe('handleWinnerSelected', () => {
    it('should send winner email', async () => {
      const event = new WinnerSelectedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        faker.internet.email(),
        faker.person.fullName(),
      );

      await listener.handleWinnerSelected(event);

      expect(mailService.send).toHaveBeenCalledWith(
        event.email,
        'Congratulations! You won the raffle!',
        expect.stringContaining(event.name),
        { entryId: event.entryId, type: 'winner' },
      );
    });
  });

  describe('handleNonWinnersSelected', () => {
    it('should send emails to non-winners', async () => {
      const nonWinners: RaffleEntry[] = [
        {
          id: faker.number.int({ min: 1, max: 10000 }),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          createdAt: faker.date.recent(),
        },
      ];
      const event = new NonWinnersSelectedEvent(nonWinners);

      await listener.handleNonWinnersSelected(event);

      expect(mailService.send).toHaveBeenCalledWith(
        nonWinners[0].email,
        'Raffle results',
        expect.stringContaining(nonWinners[0].name),
        { entryId: nonWinners[0].id, type: 'non-winner' },
      );
    });
  });

  describe('handleRaffleDrawExecuted', () => {
    it('should save raffle result', async () => {
      const event = new RaffleDrawExecutedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        faker.internet.email(),
        faker.person.fullName(),
        faker.number.int({ min: 1, max: 100 }),
        faker.date.recent(),
      );

      await listener.handleRaffleDrawExecuted(event);

      expect(raffleResultService.saveResult).toHaveBeenCalledWith(
        event.winnerId,
        event.winnerEmail,
        event.winnerName,
        event.totalEntries,
      );
    });
  });
});
