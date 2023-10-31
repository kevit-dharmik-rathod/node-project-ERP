import {Router} from 'express';
import {
  getProfile,
  getStudent,
  getStudents,
  loginStudent,
  logoutStudent,
  newStudent,
  updateProfile,
  deleteStudent
} from './student.controllers';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';

const route = 'students';
export const router = Router();

//get all students
router.get(`/${route}/getStudents`, authentication, authorization(['STAFF', 'ADMIN']), getStudents);

//post student
router.post(`/${route}/signup`, authentication, authorization(['STAFF', 'ADMIN']), newStudent);

//login student
router.post(`/${route}/login`, loginStudent);

//get Own profile
router.get(`/${route}/me`, authentication, authorization(['STUDENT']), getProfile);

//logout student
router.post(`/${route}/logout/me`, authentication, logoutStudent);

//update profile
router.patch(`/${route}/:id`, authentication, authorization(['ADMIN', 'STAFF', 'STUDENT']), updateProfile);

//get student by id
router.get(`/${route}/:id`, authentication, authorization(['STAFF', 'ADMIN']), getStudent);

//delete student
router.delete(`/${route}/:id`, authentication, authorization(['STAFF', 'ADMIN']), deleteStudent);