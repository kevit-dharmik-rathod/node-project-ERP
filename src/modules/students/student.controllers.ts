import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import {createStudent, findByEmail, findStudentById, findStudents, findAndDelete} from './student.services';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';

export const getStudents = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const students = await findStudents();
    return res.status(200).send({success: true, data: students});
  } catch (err) {
    logger.error(`Error occurred while getting students ${err}`);
    next(err);
  }
};

export const newStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await createStudent(req.body);
    return res.status(201).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error occurred in controller while creating student ${err}`);
    next(err);
  }
};

export const getStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await findStudentById(req.params.id);
    return res.status(200).send({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while get student by id ${err}`);
    next(err);
  }
};

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

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id, role} = req['auth'];
    const student = await findStudentById(req.params.id);
    if (!student) {
      throw utilityError(400, 'User not exist with this id');
    }
    const data = req.body;
    if (role === 'ADMIN' || role === 'STAFF') {
      const allowedProperties = ['name', 'email', 'password', 'designation', 'mobile', 'department', 'isAdmin'];
      for (const prop in data) {
        if (allowedProperties.includes(prop)) {
          student[prop] = data[prop];
        } else {
          throw utilityError(400, 'additional or incorrect fields are not allowed');
        }
        await student.save();
      }
    } else {
      const allowedProperties = ['password'];
      for (const prop in data) {
        if (allowedProperties.includes(prop)) {
          student[prop] = data[prop];
        } else {
          throw utilityError(400, 'additional or incorrect fields are not allowed');
        }
      }
      await student.save();
    }
    return res.status(200).json({success: true, data: student});
  } catch (err) {
    logger.error(`Error in controller while updating own profile ${err}`);
    next(err);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const student = await findAndDelete(req.params.id);
    // logger.info(`student in controller ${student}`);
    return res.status(200).json({success: true, data: 'student deleted successfully' || 'student nor exist'});
  } catch (err) {
    logger.error(`Error in controller while deleting student ${err}`);
    next(err);
  }
};
