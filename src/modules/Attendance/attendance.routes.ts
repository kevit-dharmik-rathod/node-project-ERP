import {Router} from 'express';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';
import {getAllAttendance, createNewAttendance} from './attendance.controllers';

const route = 'attendance';
export const router = Router();

//get all attendances
router.get(`/${route}/all`, authentication, authorization(['ADMIN', 'STAFF']), getAllAttendance);

//create a new attendance
router.post(`/${route}/add`, authentication, authorization(['ADMIN', 'STAFF']), createNewAttendance);
