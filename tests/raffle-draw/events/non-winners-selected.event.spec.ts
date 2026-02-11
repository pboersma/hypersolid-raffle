import { faker } from '@faker-js/faker';
import { NonWinnersSelectedEvent } from '@raffle-draw/events/non-winners-selected.event';
import { RaffleEntry } from '@raffle-entry/raffle-entry.entity';

describe('NonWinnersSelectedEvent', () => {
  it('should have a static topic property', () => {
    expect(NonWinnersSelectedEvent.topic).toBe('raffle.non-winners.selected');
  });

  it('should store non-winners array', () => {
    const nonWinners: RaffleEntry[] = [
      {
        id: faker.number.int({ min: 1, max: 10000 }),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        createdAt: faker.date.recent(),
      },
      {
        id: faker.number.int({ min: 1, max: 10000 }),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        createdAt: faker.date.recent(),
      },
    ];

    const event = new NonWinnersSelectedEvent(nonWinners);

    expect(event.nonWinners).toEqual(nonWinners);
    expect(event.nonWinners).toHaveLength(2);
  });

  it('should handle empty non-winners array', () => {
    const event = new NonWinnersSelectedEvent([]);

    expect(event.nonWinners).toEqual([]);
  });
});
