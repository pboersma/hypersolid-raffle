import { Test, TestingModule } from '@nestjs/testing';
import { RaffleDrawController } from '@raffle-draw/raffle-draw.controller';
import { RaffleDrawService } from '@raffle-draw/raffle-draw.service';

describe('RaffleDrawController', () => {
  let controller: RaffleDrawController;
  let service: jest.Mocked<RaffleDrawService>;

  beforeEach(async () => {
    const mockService: Partial<jest.Mocked<RaffleDrawService>> = {
      executeForcedDraw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaffleDrawController],
      providers: [
        {
          provide: RaffleDrawService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RaffleDrawController>(RaffleDrawController);
    service = module.get(RaffleDrawService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('forceDraw', () => {
    it('should execute forced draw and return success message', async () => {
      service.executeForcedDraw.mockResolvedValue(undefined);

      const result = await controller.forceDraw();

      expect(result).toEqual({ message: 'Raffle draw executed successfully' });
      expect(service.executeForcedDraw).toHaveBeenCalledTimes(1);
    });
  });
});
