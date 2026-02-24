// apps/api/src/rpc-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch() // Temporarily catch EVERYTHING to see what's happening
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log('--- Filter Triggered ---');
    console.log('Exception Type:', exception.constructor.name);
    console.log('Exception Content:', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Try to extract status and message
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Internal server error';

    if (exception instanceof RpcException) {
      const rpcError: any = exception.getError();
      status = rpcError.status || HttpStatus.BAD_REQUEST;
      message = rpcError.message || rpcError;
    } else if (exception.status) {
      status = exception.status;
      message = exception.message;
    }

    response.status(status).json({
      status: 'error',
      message: message,
    });
  }
}