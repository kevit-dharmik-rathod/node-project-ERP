// import { NextFunction } from 'express';
import {User} from './user.model';
import {IUser} from '../interface';

export const getAllUsers = async () => {
  try {
    return await User.findById('xyz');
  } catch (err) {
    throw err;
  }
};

export const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {}
};
