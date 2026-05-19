import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = exception.error || exception;

    const rawStatus =
      errorResponse?.statusCode ??
      errorResponse?.status ??
      exception?.statusCode ??
      exception?.status;

    const status =
      typeof rawStatus === 'number' && rawStatus >= 100 && rawStatus < 600
        ? rawStatus
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      errorResponse?.message || exception?.message || 'Internal server error';

    console.error(`[Error ${status}]: ${message}`);

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
    });
  }
}
