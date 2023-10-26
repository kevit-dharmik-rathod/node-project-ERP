require('dotenv').config();
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';
import {findUserById} from '../modules/user.services';
import {jwtToken} from '../config';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw utilityError(401, 'Please Authenticate');
    }
    const {_id, role} = jwt.verify(token, jwtToken.authSecret);
    const user = await findUserById(_id);
    if (!user) {
      throw utilityError(401, 'Unauthenticated');
    }
    if (token !== user.authToken) {
      throw utilityError(401, 'Please Authenticate');
    }
    req['auth'] = {_id, role};
    next();
  } catch (err) {
    logger.error(`Error Occurred while authenticate user ${err}`);
    next(err);
  }
};
