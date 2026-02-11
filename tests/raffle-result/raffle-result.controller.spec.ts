import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleResultController } from '@raffle-result/raffle-result.controller';
import { RaffleResultService } from '@raffle-result/raffle-result.service';
import { RaffleResult } from '@raffle-result/raffle-result.entity';

describe('RaffleResultController', () => {
  let controller: RaffleResultController;
  let service: jest.Mocked<RaffleResultService>;

  const mockRaffleResult = (): RaffleResult => ({
    id: faker.number.int({ min: 1, max: 10000 }),
    winnerId: faker.number.int({ min: 1, max: 10000 }),
    winnerEmail: faker.internet.email(),
    winnerName: faker.person.fullName(),
    totalEntries: faker.number.int({ min: 1, max: 100 }),
    drawnAt: faker.date.recent(),
  });

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<RaffleResultService>> = {
      findAll: jest.fn(),
      findLatest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaffleResultController],
      providers: [
        {
          provide: RaffleResultService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RaffleResultController>(RaffleResultController);
    service = module.get(RaffleResultService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of raffle results', async () => {
      const results = [mockRaffleResult(), mockRaffleResult()];
      service.findAll.mockResolvedValue(results);

      const result = await controller.findAll();

      expect(result).toEqual(results);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no results exist', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findLatest', () => {
    it('should return the latest raffle result', async () => {
      const result = mockRaffleResult();
      service.findLatest.mockResolvedValue(result);

      const latest = await controller.findLatest();

      expect(latest).toEqual(result);
      expect(service.findLatest).toHaveBeenCalledTimes(1);
    });

    it('should return null when no results exist', async () => {
      service.findLatest.mockResolvedValue(null);

      const latest = await controller.findLatest();

      expect(latest).toBeNull();
    });
  });
});
