import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Create Raffle Entry Data Transfer Object
 * @description This data transfer object is used to transfer data between the controller and service layers of the raffle entry module.
 */
export class CreateRaffleEntryDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}
