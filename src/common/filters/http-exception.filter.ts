import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[] = 'Une erreur est survenue';
    let error: string = 'Error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = 'Error';
    } else if (typeof exceptionResponse === 'object') {
      const res = exceptionResponse as any;
      message = res.message || 'Une erreur est survenue';
      error = res.error || 'Error';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
