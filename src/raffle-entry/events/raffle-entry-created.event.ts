export class RaffleEntryCreatedEvent {
  static readonly topic = 'raffle.entry.created';

  constructor(
    public readonly entryId: number,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}
}
