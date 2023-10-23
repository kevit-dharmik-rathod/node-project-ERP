import {Router} from 'express';
import {createUser, getUserById, getUsers, updateUserById} from './user.controllers';

const route = 'users';
export const router = Router();

router.get(`/${route}`, getUsers);
router.post(`/${route}/add`, createUser);
router.get(`/${route}/:id`, getUserById);
router.patch(`/${route}/update/:id`, updateUserById);
