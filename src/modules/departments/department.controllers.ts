import {Request, Response, NextFunction} from 'express';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';
import {getAllDept} from './department.services';

/**
 * @param req => Express request
 * @param res => Express response
 * @param next => Express NextFunction middleware
 */
export const getDepartments = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const departments = await getAllDept();
    return res.status(200).json({success: true, data: departments});
  } catch (err) {
    logger.error(`Error in controller while get all departments: ${err}`);
    next(err);
  }
};

// export const createDepartment = async
