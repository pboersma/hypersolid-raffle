export class RaffleDrawExecutedEvent {
  static readonly topic = 'raffle.draw.executed';

  constructor(
    public readonly winnerId: number,
    public readonly winnerEmail: string,
    public readonly winnerName: string,
    public readonly totalEntries: number,
    public readonly drawnAt: Date,
  ) {}
}
