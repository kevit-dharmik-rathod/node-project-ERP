import {Router} from 'express';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';
import {
  getAllAttendance,
  createNewAttendance,
  getAttendanceByStudentId,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance
} from './attendance.controllers';

const route = 'attendance';
export const router = Router();

//get all attendances
router.get(`/${route}/all`, authentication, authorization(['ADMIN', 'STAFF']), getAllAttendance);

//create a new attendance
router.post(`/${route}/add`, authentication, authorization(['ADMIN', 'STAFF']), createNewAttendance);

//get attendance by student id
router.get(`/${route}/student/:id`, authentication, authorization(['ADMIN', 'STAFF']), getAttendanceByStudentId);

//update attendance by id
router.patch(`/${route}/update/:id`, authentication, authorization(['ADMIN', 'STAFF']), updateAttendance);

//get Single Attendance by id
router.get(`/${route}/:id`, authentication, authorization(['STAFF', 'ADMIN']), getSingleAttendance);

//delete Attendance by it's id
router.delete(`/${route}/delete/:id`, authentication, authorization(['ADMIN', 'STAFF']), deleteAttendance);
