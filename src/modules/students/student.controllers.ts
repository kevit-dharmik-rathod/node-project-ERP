import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import {createStudent, findByEmail, findStudentById, findStudents, findAndDelete} from './student.services';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';
import {getDeptById} from '../departments/department.services';

/**
 * get all students
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const students = await findStudents();
    return res.status(200).send({success: true, data: students});
  } catch (err) {
    logger.error(`Error occurred while getting students ${err}`);
    next(err);
  }
};

/**
 * create new student
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const newStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const department = await getDeptById(req.body.department);
    const {occupiedSeats, availableSeats} = department;
    if (occupiedSeats === availableSeats) {
      throw utilityError(400, 'seats are full');
    }
    const student = await createStudent(req.body);
    if (student) {
      if (occupiedSeats < availableSeats) {
        department.occupiedSeats += 1;
        await department.save();
      } else {
        throw utilityError(400, 'seats are full');
      }
    } else {
      throw utilityError(400, 'Due to some validation failed student not created');
    }
    return res.status(201).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error occurred in controller while creating student ${err}`);
    next(err);
  }
};

/**
 * get single student by it's id
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await findStudentById(req.params.id);
    return res.status(200).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while get student by id ${err}`);
    next(err);
  }
};

/**
 * login student
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const loginStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {email, password} = req.body;
    const student = await findByEmail(email);
    if (!student) {
      throw utilityError(404, 'student not exist');
    }
    const checkPassword = await bcrypt.compare(password, student.password);
    if (checkPassword) {
      const token = await student.generateAuthToken();
      student.authToken = token;
      await student.save();
    } else {
      throw utilityError(400, 'Invalid credentials');
    }
    return res.status(200).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while login student: ${err}`);
    next(err);
  }
};

/**
 * logout student
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const logoutStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id} = req['auth'];
    const student = await findStudentById(_id);
    student.authToken = undefined;
    await student.save();
    return res.status(200).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error occurred in controller while logout student ${err}`);
    next(err);
  }
};

/**
 * get own profile
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id} = req['auth'];
    const student = await findStudentById(_id);
    return res.status(200).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while getting student profile ${err}`);
    next(err);
  }
};

/**
 * update profile
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await findStudentById(req.params.id);
    if (!student) {
      throw utilityError(400, 'User not exist with this id');
    }
    const {department: studentDept} = student;
    const dept_s = await getDeptById(studentDept);
    const dept_body = await getDeptById(req.body.department);
    if (dept_s && dept_body) {
      if (dept_body.availableSeats === dept_body.occupiedSeats || dept_body.occupiedSeats > dept_body.availableSeats) {
        throw utilityError(400, 'No vacancies available');
      } else {
        dept_s.occupiedSeats -= 1;
        await dept_s.save();
        dept_body.occupiedSeats += 1;
        await dept_body.save();
      }
    } else {
      throw utilityError(400, 'department not exist');
    }
    const data = req.body;
    const allowedProperties = ['name', 'email', 'mobile', 'sem', 'department'];
    for (const prop in data) {
      if (allowedProperties.includes(prop)) {
        student[prop] = data[prop];
      } else {
        throw utilityError(400, 'additional or incorrect fields are not allowed');
      }
      await student.save();
    }
    return res.status(200).json({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while updating own profile ${err}`);
    next(err);
  }
};

/**
 * get own profile
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const updateSelf = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id, role} = req['auth'];
    const student = await findStudentById(_id);
    if (!student) {
      throw utilityError(400, 'User not exist with this id');
    }
    const data = req.body;
    const allowedProperties = ['password'];
    for (const prop in data) {
      if (allowedProperties.includes(prop)) {
        student[prop] = data[prop];
      } else {
        throw utilityError(400, 'additional or incorrect fields are not allowed');
      }
    }
    await student.save();
    return res.status(200).json({success: true, data: student});
  } catch (err) {
    logger.error(`Error while updating own profile ${err}`);
    next(err);
  }
};

/**
 * delete student
 * @param {Request} req => Express Request
 * @param {Response} res => Express Response
 * @param {NextFunction} next => Express next function
 * @returns {Promise<Response>} => promise with response
 */
export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await findStudentById(req.params.id);
    const {department} = student;
    const findDept = await getDeptById(department);
    logger.info(`department in delete student ${department}`);
    findDept.occupiedSeats -= 1;
    await findDept.save();
    await findAndDelete(req.params.id);
    return res.status(200).json({success: true, data: 'student deleted successfully' || 'student nor exist'});
  } catch (err) {
    logger.error(`Error in controller while deleting student ${err}`);
    next(err);
  }
};
