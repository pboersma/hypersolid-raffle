import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MailService } from '@mail/mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  afterEach(() => {
    service.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('should send an email and store it', () => {
      const to = faker.internet.email();
      const subject = faker.lorem.sentence();
      const body = faker.lorem.paragraph();

      service.send(to, subject, body);

      const sentEmails = service.getSentEmails();
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0]).toMatchObject({
        to,
        subject,
        body,
      });
      expect(sentEmails[0].sentAt).toBeInstanceOf(Date);
    });

    it('should store multiple emails', () => {
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());

      const sentEmails = service.getSentEmails();
      expect(sentEmails).toHaveLength(3);
    });

    it('should include metadata when provided', () => {
      const meta = { entryId: faker.number.int(), type: 'confirmation' };

      service.send(
        faker.internet.email(),
        faker.lorem.sentence(),
        faker.lorem.paragraph(),
        meta,
      );

      const sentEmails = service.getSentEmails();
      expect(sentEmails[0].meta).toEqual(meta);
    });
  });

  describe('getSentEmails', () => {
    it('should return a copy of the sent emails array', () => {
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());

      const emails1 = service.getSentEmails();
      const emails2 = service.getSentEmails();

      expect(emails1).toEqual(emails2);
      expect(emails1).not.toBe(emails2);
    });

    it('should return empty array when no emails sent', () => {
      const sentEmails = service.getSentEmails();
      expect(sentEmails).toEqual([]);
    });
  });

  describe('clear', () => {
    it('should remove all sent emails', () => {
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());
      service.send(faker.internet.email(), faker.lorem.sentence(), faker.lorem.paragraph());

      service.clear();

      const sentEmails = service.getSentEmails();
      expect(sentEmails).toHaveLength(0);
    });
  });
});
