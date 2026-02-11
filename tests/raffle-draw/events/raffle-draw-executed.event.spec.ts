import { faker } from '@faker-js/faker';
import { RaffleDrawExecutedEvent } from '@raffle-draw/events/raffle-draw-executed.event';

describe('RaffleDrawExecutedEvent', () => {
  it('should have a static topic property', () => {
    expect(RaffleDrawExecutedEvent.topic).toBe('raffle.draw.executed');
  });

  it('should store all constructor arguments as readonly properties', () => {
    const winnerId = faker.number.int({ min: 1, max: 10000 });
    const winnerEmail = faker.internet.email();
    const winnerName = faker.person.fullName();
    const totalEntries = faker.number.int({ min: 1, max: 100 });
    const drawnAt = faker.date.recent();

    const event = new RaffleDrawExecutedEvent(
      winnerId,
      winnerEmail,
      winnerName,
      totalEntries,
      drawnAt,
    );

    expect(event.winnerId).toBe(winnerId);
    expect(event.winnerEmail).toBe(winnerEmail);
    expect(event.winnerName).toBe(winnerName);
    expect(event.totalEntries).toBe(totalEntries);
    expect(event.drawnAt).toBe(drawnAt);
  });
});
