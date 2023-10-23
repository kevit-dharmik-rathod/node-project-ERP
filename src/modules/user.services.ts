// import { NextFunction } from 'express';
import {User} from './user.model';
import {IUser} from '../interface';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';

export const getAllUsers = async () => {
  try {
    return await User.findById('xyz');
  } catch (err) {
    // logger.info(err);
    throw utilityError(500, err);
  }
};

export const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {}
};
