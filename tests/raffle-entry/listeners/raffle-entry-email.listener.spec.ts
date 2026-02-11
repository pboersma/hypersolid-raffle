import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleEntryEmailListener } from '@raffle-entry/listeners/raffle-entry-email.listener';
import { MailService } from '@mail/mail.service';
import { RaffleEntryCreatedEvent } from '@raffle-entry/events/raffle-entry-created.event';

describe('RaffleEntryEmailListener', () => {
  let listener: RaffleEntryEmailListener;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const mockMailService: Partial<jest.Mocked<MailService>> = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleEntryEmailListener,
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    listener = module.get<RaffleEntryEmailListener>(RaffleEntryEmailListener);
    mailService = module.get(MailService);
  });

  describe('handleEntryCreated', () => {
    it('should send confirmation email with correct content', async () => {
      const event = new RaffleEntryCreatedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        faker.internet.email(),
        faker.person.fullName(),
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      expect(mailService.send).toHaveBeenCalledWith(
        event.email,
        'Raffle confirmation',
        expect.stringContaining(event.name),
        { entryId: event.entryId, type: 'confirmation' },
      );
    });
  });
});
