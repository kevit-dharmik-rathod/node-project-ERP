import {Request, Response, NextFunction} from 'express';

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  const {code, error} = JSON.parse(err.message);
  return res.status(code).json({
    success: 'error',
    error: error
  });
};
