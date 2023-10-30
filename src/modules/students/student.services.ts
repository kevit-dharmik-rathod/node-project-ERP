import {logger} from '../../utils/logger';
import {IStudent} from '../../interface';
import {Student} from './student.model';
import {utilityError} from '../../utils/utility-error-handler';

export const findStudents = async (): Promise<IStudent[]> => {
  try {
    return await Student.find();
  } catch (err) {
    logger.error(`Error occurred in services while finding students ${err}`);
    throw utilityError(500, err);
  }
};

export const createStudent = async (student: object): Promise<object> => {
  try {
    return await Student.create(student);
  } catch (err) {
    logger.error(`Error occurred in services while creating student ${err}`);
    throw utilityError(500, err);
  }
};

export const findStudentById = async (_id: string): Promise<IStudent> => {
  try {
    return await Student.findById(_id);
  } catch (err) {
    logger.error(`Error occurred while finding student by id ${err}`);
    throw utilityError(500, err);
  }
};

export const findByEmail = async (email: string): Promise<IStudent> => {
  try {
    return await Student.findOne({email});
  } catch (err) {
    logger.error(`Error occurred in services while finding student by email ${err}`);
  }
};
