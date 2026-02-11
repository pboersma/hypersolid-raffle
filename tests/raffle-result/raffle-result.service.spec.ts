import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { RaffleResultService } from '@raffle-result/raffle-result.service';
import { RaffleResult } from '@raffle-result/raffle-result.entity';

describe('RaffleResultService', () => {
  let service: RaffleResultService;
  let repo: jest.Mocked<Repository<RaffleResult>>;

  const mockRaffleResult = (): RaffleResult => ({
    id: faker.number.int({ min: 1, max: 10000 }),
    winnerId: faker.number.int({ min: 1, max: 10000 }),
    winnerEmail: faker.internet.email(),
    winnerName: faker.person.fullName(),
    totalEntries: faker.number.int({ min: 1, max: 100 }),
    drawnAt: faker.date.recent(),
  });

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<Repository<RaffleResult>>> = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveResult', () => {
    it('should create and save a raffle result', async () => {
      const winnerId = faker.number.int({ min: 1, max: 10000 });
      const winnerEmail = faker.internet.email();
      const winnerName = faker.person.fullName();
      const totalEntries = faker.number.int({ min: 1, max: 100 });
      const savedResult = mockRaffleResult();

      repo.create.mockReturnValue(savedResult);
      repo.save.mockResolvedValue(savedResult);

      const result = await service.saveResult(
        winnerId,
        winnerEmail,
        winnerName,
        totalEntries,
      );

      expect(result).toEqual(savedResult);
      expect(repo.create).toHaveBeenCalledWith({
        winnerId,
        winnerEmail,
        winnerName,
        totalEntries,
      });
      expect(repo.save).toHaveBeenCalledWith(savedResult);
    });
  });

  describe('findAll', () => {
    it('should return all raffle results ordered by draw date', async () => {
      const results = [mockRaffleResult(), mockRaffleResult()];
      repo.find.mockResolvedValue(results);

      const result = await service.findAll();

      expect(result).toEqual(results);
      expect(repo.find).toHaveBeenCalledWith({
        order: { drawnAt: 'DESC' },
      });
    });

    it('should return empty array when no results exist', async () => {
      repo.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findLatest', () => {
    it('should return the most recent raffle result', async () => {
      const result = mockRaffleResult();
      repo.findOne.mockResolvedValue(result);

      const latest = await service.findLatest();

      expect(latest).toEqual(result);
      expect(repo.findOne).toHaveBeenCalledWith({
        order: { drawnAt: 'DESC' },
      });
    });

    it('should return null when no results exist', async () => {
      repo.findOne.mockResolvedValue(null);

      const latest = await service.findLatest();

      expect(latest).toBeNull();
    });
  });
});
