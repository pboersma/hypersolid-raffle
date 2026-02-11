import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Create Raffle Entry Data Transfer Object
 * @description This data transfer object is used to create a new raffle entry.
 */
export class CreateRaffleEntryDto {
  @ApiProperty({
    description: 'Email address of the participant',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Full name of the participant',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  name: string;
}
