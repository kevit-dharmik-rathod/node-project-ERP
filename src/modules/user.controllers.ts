import {Request, Response} from 'express';
import {getAllUsers} from './user.services';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  const users = await getAllUsers();
  return res.status(200).json(users);
};
