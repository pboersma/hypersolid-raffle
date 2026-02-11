export class WinnerSelectedEvent {
  static readonly topic = 'raffle.winner.selected';

  constructor(
    public readonly entryId: number,
    public readonly email: string,
    public readonly name: string,
  ) {}
}
