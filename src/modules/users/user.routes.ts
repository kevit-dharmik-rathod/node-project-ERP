import {Router} from 'express';
import {
  createUser,
  deleteUserById,
  getMyProfile,
  getUserById,
  getUsers,
  updateUserById,
  userLogin,
  userLogout,
  updateSelf
} from './user.controllers';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';

const route = 'users';
export const router = Router();

//Adding user by only Admin
router.post(`/${route}/signup`, authentication, authorization(['ADMIN']), createUser);

//Get all users by only admin
router.get(`/${route}`, authentication, authorization(['ADMIN']), getUsers);

//login user
router.post(`/${route}/login`, userLogin);

//logout user
router.post(`/${route}/logout/me`, authentication, userLogout);

//Read only own profile
router.get(`/${route}/me`, authentication, getMyProfile);

//update own profile means admin want to update its profile
router.patch(`/${route}/update/me`, authentication, updateSelf);

//get profile by id which only access by admin
router.get(`/${route}/:id`, authentication, authorization(['ADMIN']), getUserById);

//update profile using id by admin either update own profile or update staff profile
router.patch(`/${route}/update/:id`, authentication, authorization(['ADMIN']), updateUserById);

//delete user by admin
router.delete(`/${route}/delete/:id`, authentication, authorization(['ADMIN']), deleteUserById);
