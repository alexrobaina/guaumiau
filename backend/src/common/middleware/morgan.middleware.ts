import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Custom Morgan tokens
    morgan.token('body', (req: Request) => {
      // Don't log sensitive data
      const body = { ...req.body };
      if (body.password) body.password = '***';
      if (body.refreshToken) body.refreshToken = '***';
      return JSON.stringify(body);
    });

    morgan.token('user', (req: Request) => {
      return (req as any).user?.id || 'anonymous';
    });

    // Development format - more verbose
    const devFormat =
      ':method :url :status :response-time ms - :res[content-length] - User: :user';

    // Production format - includes body for non-GET requests
    const prodFormat =
      ':remote-addr - :user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

    const format = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;

    // Create Morgan middleware
    const morganMiddleware = morgan(format, {
      stream: {
        write: (message: string) => {
          this.logger.log(message.trim());
        },
      },
      skip: (req: Request) => {
        // Skip logging for health check endpoints
        return req.url === '/health' || req.url === '/';
      },
    });

    return morganMiddleware(req, res, next);
  }
}
