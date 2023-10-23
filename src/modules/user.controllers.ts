import {NextFunction, Request, Response} from 'express';
import {getAllUsers} from './user.services';
import {utilityError} from '../utils/utility-error-handler';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const users = await getAllUsers();
    // if (users.length === 0) {
    //   throw utilityError(404, "user not found");
    // }
    return res.status(200).send({success: true, data: users});
  } catch (err) {
    next(err);
  }
};
