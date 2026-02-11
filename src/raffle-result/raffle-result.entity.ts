import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class RaffleResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  winnerId: number;

  @Column()
  winnerEmail: string;

  @Column()
  winnerName: string;

  @Column()
  totalEntries: number;

  @CreateDateColumn()
  drawnAt: Date;
}
