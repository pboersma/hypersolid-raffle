import { RaffleEntry } from '../../raffle-entry/raffle-entry.entity';

export class NonWinnersSelectedEvent {
  static readonly topic = 'raffle.non-winners.selected';

  constructor(public readonly nonWinners: RaffleEntry[]) {}
}
