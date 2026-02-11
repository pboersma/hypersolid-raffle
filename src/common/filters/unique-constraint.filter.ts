import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  ConflictException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Exception filter for handling TypeORM unique constraint violations.
 * Converts database unique constraint errors into HTTP 409 Conflict responses.
 */
@Catch(QueryFailedError)
export class UniqueConstraintFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorMessage = exception.message;

    if (errorMessage.includes('UNIQUE constraint failed')) {
      const match = errorMessage.match(/UNIQUE constraint failed:\s*(\w+)\.(\w+)/);
      const columnName = match ? match[2] : 'field';

      const conflictException = new ConflictException(
        `A record with this ${columnName} already exists`,
      );

      const status = conflictException.getStatus();
      const responseBody = conflictException.getResponse();

      response.status(status).json(responseBody);
      return;
    }

    // For other QueryFailedErrors, re-throw as internal server error
    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
