import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  message: string;
  errors?: unknown;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: ErrorResponse = { message: err.message };
    if (err.errors) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({ message: 'Internal server error' });
};
