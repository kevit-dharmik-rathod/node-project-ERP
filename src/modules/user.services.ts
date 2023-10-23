// import { NextFunction } from 'express';
import {User} from './user.model';
import {IUser} from '../interface';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';

export const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (err) {
    throw utilityError(500, err);
  }
};

export const findUserById = async (_id: string): Promise<IUser> => {
  try {
    return User.findById(_id);
  } catch (err) {
    throw utilityError(500, err);
  }
};

export const createNewUser = async (user: IUser): Promise<object> => {
  try {
    return await User.create(user);
  } catch (err) {
    throw utilityError(500, err);
  }
};

export const userFindByEmail = async (email: string): Promise<IUser> => {
  try {
    return await User.findOne({email});
  } catch (err) {
    throw utilityError(500, err);
  }
};
