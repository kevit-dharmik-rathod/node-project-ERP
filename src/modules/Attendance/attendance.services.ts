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
