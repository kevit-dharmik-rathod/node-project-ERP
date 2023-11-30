import {Attendance} from './attendance.model';
import {IAttendance} from 'interface';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';

/**
 * find all allAttendances objects
 * @returns {Promise<IAttendance[]>} => return promise with array of IAttendance objects
 */
export const getAttendances = async (): Promise<IAttendance[]> => {
  try {
    return await Attendance.find();
  } catch (err) {
    logger.error(`Error in services while getting Attendances: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * create a new Attendance object
 * @param attendance => attendance object
 * @returns {Promise<object>} => return promise with Attendance object
 */
export const attendanceCreate = async (attendance: object): Promise<object> => {
  try {
    return await Attendance.create(attendance);
  } catch (err) {
    logger.error(`Error in services while creating Attendance: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * get all attendance of particular student
 * @param _id => student id
 * @returns {Promise<object[]>} => return promise with IAttendance array
 */
export const getAllAttendanceOfStudent = async (_id: string): Promise<IAttendance[]> => {
  try {
    return await Attendance.find({studentId: _id});
  } catch (err) {
    logger.error(`Error in services while getAllAttendanceOfStudent By student ID: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * get single attendance by it's id
 * @param _id => attendance id
 * @returns {Promise<IAttendance>} => return promise with IAttendance object
 */
export const getAttendanceById = async (_id: string): Promise<IAttendance> => {
  try {
    return await Attendance.findById(_id);
  } catch (err) {
    logger.error(`Error in services while getAttendanceById: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * delete attendance by it's id
 * @param _id => attendance id
 * @returns {Promise<IAttendance>} => return promise with IAttendance object
 */
export const deleteAttendanceById = async (_id: string): Promise<string> => {
  try {
    const attendance = await Attendance.findByIdAndDelete(_id);
    if (!attendance) {
      throw new Error(`Attendance not found`);
    }
    return 'Attendance deleted successfully';
  } catch (err) {
    logger.error(`Error in services while deleting attendance`);
    throw utilityError(500, err);
  }
};
