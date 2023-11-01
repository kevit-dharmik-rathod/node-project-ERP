import {logger} from '../../utils/logger';
import {IStudent} from '../../interface';
import {Student} from './student.model';
import {utilityError} from '../../utils/utility-error-handler';

/**
 * @returns {Promise<IStudent[]} => return promise with array of students
 */
export const findStudents = async (): Promise<IStudent[]> => {
  try {
    return await Student.find();
  } catch (err) {
    logger.error(`Error occurred in services while finding students ${err}`);
    throw utilityError(500, err);
  }
};

/**
 *
 * @param {student} => student object
 * @returns {Promise<object>} => return Promise with student object
 */
export const createStudent = async (student: object): Promise<object> => {
  try {
    return await Student.create(student);
  } catch (err) {
    logger.error(`Error occurred in services while creating student ${err}`);
    throw utilityError(500, err);
  }
};

/**
 *
 * @param _id => student id
 * @returns {Promise<IStudent>} => promise with IStudent object
 */
export const findStudentById = async (_id: string): Promise<IStudent> => {
  try {
    return await Student.findById(_id);
  } catch (err) {
    logger.error(`Error occurred while finding student by id ${err}`);
    throw utilityError(500, err);
  }
};

/**
 *
 * @param email => string
 * @returns {Promise<IStudent>} => return a Promise with IStudent object
 */
export const findByEmail = async (email: string): Promise<IStudent> => {
  try {
    return await Student.findOne({email});
  } catch (err) {
    logger.error(`Error occurred in services while finding student by email ${err}`);
    throw utilityError(500, err);
  }
};

/**
 *
 * @param _id => student id
 * @returns {Promise<IStudent>} => return a Promise with IStudent object
 */
export const findAndDelete = async (_id: string): Promise<IStudent> => {
  try {
    return await Student.findByIdAndDelete(_id);
  } catch (err) {
    logger.error(`Error occurred in services while deleting user by it's id ${err}`);
    throw utilityError(500, err);
  }
};
