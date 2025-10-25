import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';

    switch (exception.code) {
      case 'P2000':
        status = HttpStatus.BAD_REQUEST;
        message = 'The value provided is too long for the column';
        break;
      case 'P2001':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = exception.meta?.target as string[];
        message = `Unique constraint failed on: ${target?.join(', ') || 'field'}`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record to update/delete not found';
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unexpected database error occurred';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: 'DatabaseError',
      code: exception.code,
    };

    this.logger.error(
      `Prisma Error: ${exception.code}`,
      JSON.stringify({
        code: exception.code,
        message: exception.message,
        meta: exception.meta,
      }),
    );

    response.status(status).json(errorResponse);
  }
}
