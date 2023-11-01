import {User} from './user.model';
import {IUser} from '../../interface';
import {utilityError} from '../../utils/utility-error-handler';
import {logger} from '../../utils/logger';

/**
 * @returns {Promise<IUser>} => return promise with IUser array
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    return await User.find();
  } catch (err) {
    logger.error(`Error occurred while getting users :${err}`);
    throw utilityError(500, err);
  }
};

/**
 * @param _id => user id
 * @returns {Promise<IUser>} => return promise with IUser object
 */
export const findUserById = async (_id: string): Promise<IUser> => {
  try {
    return User.findById(_id);
  } catch (err) {
    logger.error(`Error occurred while finding user by its id : ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * @param user => user object which is get as request body
 * @returns {Promise<object>} => return a promise with object
 */
export const createNewUser = async (user: IUser): Promise<object> => {
  try {
    return await User.create(user);
  } catch (err) {
    logger.error(`Error occurred while creating user: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * @param email => user email
 * @returns {Promise<IUser>} => return a promise with IUser
 */
export const userFindByEmail = async (email: string): Promise<IUser> => {
  try {
    return await User.findOne({email});
  } catch (err) {
    logger.error(`Error occurred while finding user by it's email ${err}`);
    throw utilityError(500, err);
  }
};

/**
 *
 * @param _id => user id
 * @returns {Promise<IUser>} => return a promise with IUser
 */
export const deleteUser = async (_id: string): Promise<IUser> => {
  try {
    return await User.findByIdAndDelete(_id);
  } catch (err) {
    logger.error(`Error occurred while deleting user: ${err}`);
    throw utilityError(500, err);
  }
};
