import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RaffleResult } from '@raffle-result/raffle-result.entity';

export const ApiRaffleResultFindAll = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all raffle results' }),
    ApiResponse({
      status: 200,
      description: 'List of all raffle results ordered by draw date (newest first)',
      type: [RaffleResult],
    }),
  );

export const ApiRaffleResultFindLatest = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get the latest raffle result' }),
    ApiResponse({
      status: 200,
      description: 'Most recent raffle result',
      type: RaffleResult,
    }),
    ApiResponse({ status: 200, description: 'No results found' }),
  );
