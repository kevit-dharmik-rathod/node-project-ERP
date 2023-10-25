import {Router} from 'express';
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
  userLogin,
  userLogout
} from './user.controllers';

const route = 'users';
export const router = Router();

router.post(`/${route}/add`, createUser);
router.get(`/${route}`, getUsers);
router.post(`/${route}/login`, userLogin);
router.post(`/${route}/logout/:id`, userLogout);
router.get(`/${route}/:id`, getUserById);
router.patch(`/${route}/update/:id`, updateUserById);
router.delete(`/${route}/:id`, deleteUserById);
