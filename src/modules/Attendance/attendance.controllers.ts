import {Request, Response, NextFunction} from 'express';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';
import {
  getAttendances,
  attendanceCreate,
  getAllAttendanceOfStudent,
  getAttendanceById,
  deleteAttendanceById
} from './attendance.services';
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

/**
 * get All attendance by student id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const getAttendanceByStudentId = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const attendance = await getAllAttendanceOfStudent(req.params.id);
    return res.status(200).send({success: true, data: attendance});
  } catch (err) {
    logger.error(`Error in controller while getAttendanceByStudentId ${err}`);
    next(err);
  }
};

/**
 * update attendance by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const updateAttendance = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const attendance = await getAttendanceById(req.params.id);
    const data = req.body;
    for (const prop in data) {
      attendance[prop] = data[prop];
    }
    await attendance.save();
    return res.status(200).send({success: true, data: attendance});
  } catch (err) {
    logger.error(`Error in controller while updateAttendance: ${err}`);
    next(err);
  }
};

/**
 * get Single Attendance by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const getSingleAttendance = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const attendance = await getAttendanceById(req.params.id);
    return res.status(200).send({success: true, data: attendance});
  } catch (err) {
    logger.error(`Error in controller while getting single attendance: ${err}`);
    next(err);
  }
};

/**
 * delete attendance by it's id
 * @param {Request} req => Express request
 * @param {Response} res => Express response
 * @param {NextFunction} next => Express middleware function
 * @returns {Promise<Response>} => return promise with Express Response
 */
export const deleteAttendance = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const attendance = await deleteAttendanceById(req.params.id);
    return res.status(200).send({success: true, data: 'Successfully deleted attendance'});
  } catch (err) {}
};
