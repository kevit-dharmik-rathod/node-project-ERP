import {Request, Response, NextFunction} from 'express';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';

export const authorization = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const {_id, role} = req['auth'];
    if (!roles.includes(role)) {
      throw utilityError(403, 'Unauthorized');
    }
    next();
  };
};
