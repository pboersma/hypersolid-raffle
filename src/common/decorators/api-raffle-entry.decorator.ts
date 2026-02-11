import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RaffleEntryResponseDto } from '@raffle-entry/dto/raffle-entry-response.dto';
import { CreateRaffleEntryDto } from '@raffle-entry/dto/create-raffle-entry.dto';

export const ApiRaffleEntryFindAll = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all raffle entries' }),
    ApiResponse({
      status: 200,
      description: 'List of all raffle entries',
      type: [RaffleEntryResponseDto],
    }),
  );

export const ApiRaffleEntryFindOne = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get a raffle entry by ID' }),
    ApiParam({
      name: 'id',
      description: 'Raffle entry ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Raffle entry found',
      type: RaffleEntryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Raffle entry not found' }),
  );

export const ApiRaffleEntryCreate = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new raffle entry' }),
    ApiBody({ type: CreateRaffleEntryDto }),
    ApiResponse({
      status: 201,
      description: 'Raffle entry created successfully',
      type: RaffleEntryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Invalid input data' }),
    ApiResponse({ status: 409, description: 'Email already registered' }),
  );

export const ApiRaffleEntryUpdate = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a raffle entry' }),
    ApiParam({
      name: 'id',
      description: 'Raffle entry ID',
      example: 1,
    }),
    ApiBody({ type: CreateRaffleEntryDto }),
    ApiResponse({
      status: 200,
      description: 'Raffle entry updated successfully',
      type: RaffleEntryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Raffle entry not found' }),
  );

export const ApiRaffleEntryDelete = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a raffle entry' }),
    ApiParam({
      name: 'id',
      description: 'Raffle entry ID',
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'Raffle entry deleted successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Raffle entry not found' }),
  );
