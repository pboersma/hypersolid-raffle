import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleEntryEmailListener } from './raffle-entry-email.listener';
import { MailService } from '../../mail/mail.service';
import { RaffleEntryCreatedEvent } from '../events/raffle-entry-created.event';

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

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleEntryCreated', () => {
    it('should send a confirmation email', async () => {
      const event = new RaffleEntryCreatedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        faker.internet.email(),
        faker.person.fullName(),
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      expect(mailService.send).toHaveBeenCalledTimes(1);
      expect(mailService.send).toHaveBeenCalledWith(
        event.email,
        'Raffle confirmation',
        `Hi ${event.name},\n\nThanks for entering the raffle!\n\nEntry ID: ${event.entryId}`,
        { entryId: event.entryId, type: 'confirmation' },
      );
    });

    it('should send email to the correct recipient', async () => {
      const email = faker.internet.email();
      const event = new RaffleEntryCreatedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        email,
        faker.person.fullName(),
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      expect(mailService.send.mock.calls[0][0]).toBe(email);
    });

    it('should include the entry id in the email body', async () => {
      const entryId = faker.number.int({ min: 1, max: 10000 });
      const event = new RaffleEntryCreatedEvent(
        entryId,
        faker.internet.email(),
        faker.person.fullName(),
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      const body = mailService.send.mock.calls[0][2];
      expect(body).toContain(`Entry ID: ${entryId}`);
    });

    it('should include the name in the email body', async () => {
      const name = faker.person.fullName();
      const event = new RaffleEntryCreatedEvent(
        faker.number.int({ min: 1, max: 10000 }),
        faker.internet.email(),
        name,
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      const body = mailService.send.mock.calls[0][2];
      expect(body).toContain(`Hi ${name}`);
    });

    it('should include confirmation metadata', async () => {
      const entryId = faker.number.int({ min: 1, max: 10000 });
      const event = new RaffleEntryCreatedEvent(
        entryId,
        faker.internet.email(),
        faker.person.fullName(),
        faker.date.recent(),
      );

      await listener.handleEntryCreated(event);

      const meta = mailService.send.mock.calls[0][3];
      expect(meta).toEqual({ entryId, type: 'confirmation' });
    });
  });
});
