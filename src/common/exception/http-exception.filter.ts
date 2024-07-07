import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as
            | string
            | { statusCode: number; message: string };

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message:
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : exceptionResponse.message,
        };

        response.status(status).json(errorResponse);
    }
}
