/**
 * Raffle Entry Response Data Transfer Object
 * @description This data transfer object is used to transfer data between the controller and service layers of the raffle entry module.
 */
export class RaffleEntryResponseDto {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}
