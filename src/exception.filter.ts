import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 
      exception instanceof HttpException 
        ? exception.getStatus() 
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message || 'Internal server error';

    if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;

      const duplicateField = exception.message.match(/index: (\w+)_\d+/)?.[1];
      const duplicateValue = exception.message.match(/dup key: \{ (.+?) \}/)?.[1];

      if (duplicateField === 'email' && duplicateValue) {
        message = `User with mail '${duplicateValue}' already exist.`;
      } else {
        message = `Duplicate key error on field '${duplicateField}' with value '${duplicateValue}'.`;
      }
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    response.status(status).json(errorResponse);
  }
}