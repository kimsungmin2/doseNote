import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponseBody {
    const defaultResponse: ErrorResponseBody = {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownRequestError(exception, request);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        message: '잘못된 데이터 요청입니다.',
        path: request.url,
        timestamp: new Date().toISOString(),
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[] = exception.message;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseBody = exceptionResponse as {
          message?: string | string[];
        };

        if (responseBody.message) {
          message = responseBody.message;
        }
      }

      return {
        success: false,
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      };
    }

    return defaultResponse;
  }

  private handlePrismaKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    request: Request,
  ): ErrorResponseBody {
    switch (exception.code) {
      case 'P2002':
        return {
          success: false,
          statusCode: HttpStatus.CONFLICT,
          message: '이미 존재하는 데이터입니다.',
          path: request.url,
          timestamp: new Date().toISOString(),
        };

      case 'P2003':
        return {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: '연결된 데이터 제약 조건에 위반됩니다.',
          path: request.url,
          timestamp: new Date().toISOString(),
        };

      case 'P2025':
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: '대상 데이터를 찾을 수 없습니다.',
          path: request.url,
          timestamp: new Date().toISOString(),
        };

      default:
        return {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: '데이터 처리 중 오류가 발생했습니다.',
          path: request.url,
          timestamp: new Date().toISOString(),
        };
    }
  }
}
