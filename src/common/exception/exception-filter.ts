import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export class ApiErrors implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger('ApiErrors');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = (res as any)?.message || res.toString();
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    logger.error(`{${request.url}} - [${status}] [Error: ${message}]`);

    response.status(status).json({
      success: false,
      status_code: status,
      path: request.url,
      timestamp: new Date(),
      error: message,
    });
  }
}
