import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { RaffleEntryController } from './raffle-entry.controller';
import { RaffleEntryService } from './raffle-entry.service';
import { RaffleEntryResponseDto } from './dto/raffle-entry-response.dto';
import { CreateRaffleEntryDto } from './dto/create-raffle-entry.dto';

describe('RaffleEntryController', () => {
  let controller: RaffleEntryController;
  let service: jest.Mocked<RaffleEntryService>;

  const mockResponseDto = (): RaffleEntryResponseDto => ({
    id: faker.number.int({ min: 1, max: 10000 }),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: faker.date.recent(),
  });

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<RaffleEntryService>> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of raffle entries', async () => {
      const entries = [mockResponseDto(), mockResponseDto()];
      service.findAll.mockResolvedValue(entries);

      const result = await controller.findAll();

      expect(result).toEqual(entries);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no entries exist', async () => {
      service.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single raffle entry', async () => {
      const entry = mockResponseDto();
      service.findOne.mockResolvedValue(entry);

      const result = await controller.findOne(String(entry.id));

      expect(result).toEqual(entry);
      expect(service.findOne).toHaveBeenCalledWith(entry.id);
    });

    it('should return null when entry is not found', async () => {
      const id = faker.number.int({ min: 1, max: 10000 });
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne(String(id));

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should convert the id param from string to number', async () => {
      service.findOne.mockResolvedValue(null);

      await controller.findOne('42');

      expect(service.findOne).toHaveBeenCalledWith(42);
    });
  });

  describe('create', () => {
    it('should create and return a new raffle entry', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const createdEntry = mockResponseDto();
      service.create.mockResolvedValue(createdEntry);

      const result = await controller.create(dto);

      expect(result).toEqual(createdEntry);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should pass the dto directly to the service', async () => {
      const dto: CreateRaffleEntryDto = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      service.create.mockResolvedValue(mockResponseDto());

      await controller.create(dto);

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
