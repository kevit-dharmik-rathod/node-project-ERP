import {Router} from 'express';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';
import {createDepartment, deleteDept, getDepartment, getDepartments, updateDepartment} from './department.controllers';

const route = 'depts';
export const router = Router();

//get All Departments
router.get(`/${route}/`, authentication, authorization(['ADMIN']), getDepartments);

//create new department
router.post(`/${route}/add`, authentication, authorization(['ADMIN']), createDepartment);

//get Department by id
router.get(`/${route}/:id`, authentication, authorization(['ADMIN']), getDepartment);

//update deparment
router.patch(`/${route}/update/:id`, authentication, authorization(['ADMIN']), updateDepartment);

//delete department
router.delete(`/${route}/delete/:id`, authentication, authorization(['ADMIN']), deleteDept);
