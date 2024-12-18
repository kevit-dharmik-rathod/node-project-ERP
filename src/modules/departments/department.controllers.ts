import {Request, Response, NextFunction} from 'express';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';
import {
  getAllDept,
  CreateNewDepartment,
  getDeptById,
  getAndDelete,
  task1,
  task2,
  task3,
  task4
} from './department.services';

/**
 * get all departments
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
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

/**
 * create new department
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const createDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const department = await CreateNewDepartment(req.body);
    return res.status(201).send({success: true, data: department});
  } catch (err) {
    logger.error(`Error in controller while creating new department: ${err}`);
    next(err);
  }
};

/**
 * get single department by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const getDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const dept = await getDeptById(req.params.id);
    return res.status(200).send({success: true, data: dept});
  } catch (err) {
    logger.error(`Error in controller while getting department: ${err}`);
    next(err);
  }
};

/**
 * update department by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const updateDepartment = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const dept = await getDeptById(req.params.id);
    if (!dept) {
      throw utilityError(400, 'Department not exist');
    }
    const body = req.body;
    const allowedProperties = ['name', 'initials', 'availableSeats', 'batch', 'occupiedSeats'];
    for (const prop in body) {
      if (allowedProperties.includes(prop)) {
        dept[prop] = body[prop];
      } else {
        throw utilityError(400, 'additional or incorrect fields are not allowed');
      }
    }
    await dept.save();
    return res.status(200).send({success: true, data: dept});
  } catch (err) {
    logger.error(`Error in controller while updating department: ${err}`);
    next(err);
  }
};

/**
 * delete dept by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const deleteDept = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const dept = await getAndDelete(req.params.id);
    return res.status(200).send({success: true, data: 'Department deleted successfully'});
  } catch (err) {
    logger.error(`Error in controller while deleting department: ${err}`);
  }
};

/**
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const query1 = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const result = await task1();
    return res.status(200).send({success: true, data: result});
  } catch (err) {
    logger.error(`Error in controller while perform query1 :${err}`);
    next(err);
  }
};

/**
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const query2 = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const result = await task2(req.body);
    return res.status(200).send({success: true, data: result});
  } catch (err) {
    logger.error(`Error in controller while perform query2 :${err}`);
    next(err);
  }
};

/**
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const query3 = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const result = await task3(req.body);
    return res.status(200).send({success: true, data: result});
  } catch (err) {
    logger.error(`Error in controller while perform query3 :${err}`);
    next(err);
  }
};

/**
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const query4 = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    logger.info('entering in to query4');
    const result = await task4(req.body);
    logger.info('result is ', result);
    return res.status(200).send({success: true, data: result});
  } catch (err) {
    logger.error(`Error in controller while fetching vacant seats: ${err}`);
    next(err);
  }
};
