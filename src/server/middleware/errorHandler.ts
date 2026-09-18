import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[API Error]:', err.message || err);

  let statusCode = 500;
  if (err.status) {
    statusCode = err.status;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (typeof err.message === 'string') {
    if (err.message.includes('not configured')) statusCode = 503;
    else if (err.message.includes('Invalid Spoonacular API key')) statusCode = 401;
    else if (err.message.includes('quota exceeded')) statusCode = 402;
    else if (err.message.includes('not found')) statusCode = 404;
    else if (err.message.includes('required')) statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    code: err.code || (statusCode === 503 ? 'SERVICE_UNAVAILABLE' : 'API_ERROR'),
  });
}
