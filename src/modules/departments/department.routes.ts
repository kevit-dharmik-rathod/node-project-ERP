import {Router} from 'express';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';
import {
  createDepartment,
  deleteDept,
  getDepartment,
  getDepartments,
  query1,
  query2,
  query3,
  query4,
  updateDepartment
} from './department.controllers';

const route = 'depts';
export const router = Router();

//Query1 for getting year, totalStudents and branch wise total students
router.get(`/${route}/query1`, authentication, authorization(['ADMIN']), query1);

//Query2 for getting list of students absent on specific day
router.post(`/${route}/query2`, authentication, authorization(['ADMIN', 'STAFF']), query2);

//Query3 for getting list of student which attendance is less than 75% up to date which we give as a input.
router.post(`/${route}/query3`, authentication, authorization(['ADMIN', 'STAFF']), query3);

//Query4 getting vacant seats year wise
router.post(`/${route}/query4`, authentication, authorization(['ADMIN', 'STAFF']), query4);

//get All Departments
router.get(`/${route}/`, authentication, authorization(['ADMIN']), getDepartments);

//create new department
router.post(`/${route}/add`, authentication, authorization(['ADMIN']), createDepartment);

//get Department by id
router.get(`/${route}/:id`, authentication, authorization(['ADMIN']), getDepartment);

//update department
router.patch(`/${route}/update/:id`, authentication, authorization(['ADMIN']), updateDepartment);

//delete department
router.delete(`/${route}/delete/:id`, authentication, authorization(['ADMIN']), deleteDept);
