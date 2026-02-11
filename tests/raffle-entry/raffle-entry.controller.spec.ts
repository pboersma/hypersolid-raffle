import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleEntryController } from '@raffle-entry/raffle-entry.controller';
import { RaffleEntryService } from '@raffle-entry/raffle-entry.service';
import { CreateRaffleEntryDto } from '@raffle-entry/dto/create-raffle-entry.dto';

describe('RaffleEntryController', () => {
  let controller: RaffleEntryController;
  let service: jest.Mocked<RaffleEntryService>;

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<RaffleEntryService>> = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaffleEntryController],
      providers: [
        {
          provide: RaffleEntryService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RaffleEntryController>(RaffleEntryController);
    service = module.get(RaffleEntryService);
  });

  describe('create', () => {
    it('should delegate to service', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const createdEntry = {
        id: 1,
        email: dto.email,
        name: dto.name,
        createdAt: new Date(),
      };
      service.create.mockResolvedValue(createdEntry as any);

      const result = await controller.create(dto);

      expect(result).toEqual(createdEntry);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
