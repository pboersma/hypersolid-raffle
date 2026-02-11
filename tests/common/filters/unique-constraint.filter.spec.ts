import { ArgumentsHost, ConflictException } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { UniqueConstraintFilter } from '@src/common/filters/unique-constraint.filter';

describe('UniqueConstraintFilter', () => {
  let filter: UniqueConstraintFilter;
  let mockResponse: Partial<Response>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new UniqueConstraintFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should convert UNIQUE constraint error to 409 Conflict response', () => {
    const errorMessage = 'UNIQUE constraint failed: raffle_entry.email';
    const exception = new QueryFailedError(
      'INSERT INTO raffle_entry',
      [],
      new Error(errorMessage),
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'A record with this email already exists',
      error: 'Conflict',
    });
  });

  it('should use generic field name when column cannot be extracted', () => {
    const errorMessage = 'UNIQUE constraint failed';
    const exception = new QueryFailedError(
      'INSERT INTO raffle_entry',
      [],
      new Error(errorMessage),
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'A record with this field already exists',
      error: 'Conflict',
    });
  });

  it('should return 500 for other QueryFailedErrors', () => {
    const exception = new QueryFailedError(
      'SELECT * FROM raffle_entry',
      [],
      new Error('Some other database error'),
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Internal server error',
    });
  });
});
