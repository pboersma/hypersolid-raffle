import { ApiProperty } from '@nestjs/swagger';

/**
 * Raffle Entry Response Data Transfer Object
 * @description This data transfer object represents a raffle entry in API responses.
 */
export class RaffleEntryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the raffle entry',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email address of the participant',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Full name of the participant',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Timestamp when the entry was created',
    example: '2026-02-11T10:27:03.000Z',
  })
  createdAt: Date;
}
