import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { RaffleResultService } from '@raffle-result/raffle-result.service';
import { RaffleResult } from '@raffle-result/raffle-result.entity';

describe('RaffleResultService', () => {
  let service: RaffleResultService;
  let repo: jest.Mocked<Repository<RaffleResult>>;

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<Repository<RaffleResult>>> = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleResultService,
        {
          provide: 'RAFFLE_RESULT_REPOSITORY',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<RaffleResultService>(RaffleResultService);
    repo = module.get('RAFFLE_RESULT_REPOSITORY');
  });

  describe('saveResult', () => {
    it('should create and save a raffle result', async () => {
      const winnerId = faker.number.int({ min: 1, max: 10000 });
      const winnerEmail = faker.internet.email();
      const winnerName = faker.person.fullName();
      const totalEntries = faker.number.int({ min: 1, max: 100 });
      const savedResult: RaffleResult = {
        id: faker.number.int({ min: 1, max: 10000 }),
        winnerId,
        winnerEmail,
        winnerName,
        totalEntries,
        drawnAt: faker.date.recent(),
      };

      repo.create.mockReturnValue(savedResult);
      repo.save.mockResolvedValue(savedResult);

      const result = await service.saveResult(
        winnerId,
        winnerEmail,
        winnerName,
        totalEntries,
      );

      expect(result).toEqual(savedResult);
    });
  });
});
