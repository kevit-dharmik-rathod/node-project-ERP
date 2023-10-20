import {NextFunction, Request, Response} from 'express';
import {getAllUsers} from './user.services';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(new Error("Couldn't get users"));
  }
};
