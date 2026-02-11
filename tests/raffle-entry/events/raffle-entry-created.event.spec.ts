import { faker } from '@faker-js/faker';
import { RaffleEntryCreatedEvent } from '@raffle-entry/events/raffle-entry-created.event';

describe('RaffleEntryCreatedEvent', () => {
  it('should have a static topic property', () => {
    expect(RaffleEntryCreatedEvent.topic).toBe('raffle.entry.created');
  });

  it('should store all constructor arguments as readonly properties', () => {
    const entryId = faker.number.int({ min: 1, max: 10000 });
    const email = faker.internet.email();
    const name = faker.person.fullName();
    const createdAt = faker.date.recent();

    const event = new RaffleEntryCreatedEvent(entryId, email, name, createdAt);

    expect(event.entryId).toBe(entryId);
    expect(event.email).toBe(email);
    expect(event.name).toBe(name);
    expect(event.createdAt).toBe(createdAt);
  });

  it('should create distinct instances with different data', () => {
    const event1 = new RaffleEntryCreatedEvent(
      faker.number.int({ min: 1, max: 10000 }),
      faker.internet.email(),
      faker.person.fullName(),
      faker.date.recent(),
    );
    const event2 = new RaffleEntryCreatedEvent(
      faker.number.int({ min: 1, max: 10000 }),
      faker.internet.email(),
      faker.person.fullName(),
      faker.date.recent(),
    );

    expect(event1).not.toBe(event2);
    expect(event1.entryId).not.toBe(event2.entryId);
  });
});
