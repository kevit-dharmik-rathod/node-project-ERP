import {Dept} from './department.model';
import {IDept} from '../../interface';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';

/**
 * get all departments
 * @returns {Promise<IDept>} => return promise with array of departments
 */
export const getAllDept = async (): Promise<IDept[]> => {
  try {
    return await Dept.find();
  } catch (err) {
    logger.error(`Error in dept service while finding all depts: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * create new department
 * @param dept => req.body object passed as dept object
 * @returns {Promise<object>} => return promise with dept object
 */
export const CreateNewDepartment = async (dept: object): Promise<object> => {
  try {
    return await Dept.create(dept);
  } catch (err) {
    logger.error(`Error in services while creating new department ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * get dept by it's id
 * @param id => dept id
 * @returns {Promise<IDept>} => return a promise of dept object
 */
export const getDeptById = async (_id: string): Promise<IDept> => {
  try {
    return await Dept.findById(_id);
  } catch (err) {
    logger.error(`Error in dept service while finding dept by id: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * find and delete dept by it's id
 * @param id
 * @returns {Promise<IDept>} => return a promise with IDept object
 */
export const getAndDelete = async (_id: string): Promise<IDept> => {
  try {
    return await Dept.findOneAndDelete({_id});
  } catch (err) {
    logger.error(`Error in dept service while deleting dept by id: ${err}`);
    throw utilityError(500, err);
  }
};
