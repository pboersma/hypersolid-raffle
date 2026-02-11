import { faker } from '@faker-js/faker';
import { WinnerSelectedEvent } from '@raffle-draw/events/winner-selected.event';

describe('WinnerSelectedEvent', () => {
  it('should have a static topic property', () => {
    expect(WinnerSelectedEvent.topic).toBe('raffle.winner.selected');
  });

  it('should store all constructor arguments as readonly properties', () => {
    const entryId = faker.number.int({ min: 1, max: 10000 });
    const email = faker.internet.email();
    const name = faker.person.fullName();

    const event = new WinnerSelectedEvent(entryId, email, name);

    expect(event.entryId).toBe(entryId);
    expect(event.email).toBe(email);
    expect(event.name).toBe(name);
  });
});
