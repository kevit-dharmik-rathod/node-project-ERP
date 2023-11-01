import {Request, Response, NextFunction} from 'express';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';
import {getAttendances, attendanceCreate} from './attendance.services';
import {findStudentById} from '../students/student.services';

/**
 * get all attendances
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const getAllAttendance = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const attendance = await getAttendances();
    return res.status(200).send({success: true, data: attendance});
  } catch (err) {
    logger.error(`Error in controller while getAllAttendance: ${err}`);
    next(err);
  }
};

/**
 * create a new attendance
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const createNewAttendance = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {studentId} = req.body;
    const student = await findStudentById(studentId);
    if (!student) {
      throw utilityError(400, 'student not exist with this id');
    }
    const attendance = await attendanceCreate(req.body);
    return res.status(200).send({success: true, data: attendance});
  } catch (err) {
    logger.error(`Error in controller while createNewAttendance: ${err}`);
    next(err);
  }
};
