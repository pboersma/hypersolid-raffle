import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export const ApiRaffleDrawForce = () =>
  applyDecorators(
    ApiOperation({ summary: 'Execute a forced raffle draw' }),
    ApiResponse({
      status: 200,
      description: 'Raffle draw executed successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Raffle draw executed successfully',
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'No entries found for draw' }),
  );
