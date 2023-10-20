import {User} from './user.model';
import {IUser} from '../interface';

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    return await User.find();
  } catch (err) {
    throw err;
  }
};

export const getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (err) {}
};
