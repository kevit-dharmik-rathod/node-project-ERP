import {dept} from './department.model';
import {IDept} from '../../interface';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';

export const getAllDept = async (): Promise<IDept[]> => {
  try {
    return await dept.find();
  } catch (err) {
    logger.error(`Error in dept service while finding all depts: ${err}`);
    throw utilityError(500, err);
  }
};
