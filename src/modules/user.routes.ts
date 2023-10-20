import {Router} from 'express';
import {getUsers} from './user.controllers';

const route = 'users';
export const router = Router();

router.get(`/${route}`, getUsers);
