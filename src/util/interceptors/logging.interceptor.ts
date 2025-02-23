import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  dirname: path.join(__dirname, '../../../logs'),
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '5d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM_DD HH:MM:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level}] ${message}`;
    }),
  ),
  transports: [transport, new winston.transports.Console()],
});

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - start;
        const res = context.switchToHttp().getResponse();
        const { statusCode } = res;
        const message = `${statusCode} - ${method} - Path: ${url} - ${responseTime}ms`;
        logger.info(message);
      }),
    );
  }
}
