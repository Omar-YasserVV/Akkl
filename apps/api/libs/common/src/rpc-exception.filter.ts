import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('Raw Exception:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.status && typeof exception.status === 'number') {
      status = exception.status;
    } else if (exception.statusCode && typeof exception.statusCode === 'number') {
      status = exception.statusCode;
    }

    const message = exception.message || 'Internal server error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message,
    });
  }
}