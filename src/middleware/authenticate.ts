require('dotenv').config();
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';
import {findUserById} from '../modules/users/user.services';
import {findStudentById} from '../modules/students/student.services';
import {jwtToken} from '../config';

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw utilityError(401, 'Please Authenticate');
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      throw utilityError(401, 'Please Authenticate');
    }
    const {_id, role} = jwt.verify(token, jwtToken.authSecret);
    const person = role === 'STUDENT' ? await findStudentById(_id) : await findUserById(_id);
    if (!person) {
      throw utilityError(401, 'Unauthenticated');
    }

    if (token !== person.authToken) {
      throw utilityError(401, 'Please Authenticate');
    }
    req['auth'] = {_id, role};
    next();
  } catch (err) {
    logger.error(`Error Occurred while authenticate user ${err}`);
    next(err);
  }
};
