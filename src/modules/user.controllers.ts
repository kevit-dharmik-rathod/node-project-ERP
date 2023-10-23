import {NextFunction, Request, Response} from 'express';
import {createNewUser, findUserById, getAllUsers} from './user.services';
import {utilityError} from '../utils/utility-error-handler';
import {logger} from '../utils/logger';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const users = await getAllUsers();
    if (users.length === 0) {
      return res.status(200).send({success: true, data: 'Not any user found.'});
    }
    return res.status(200).send({success: true, data: users});
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    // logger.info(req.body);
    const user = await createNewUser(req.body);
    return res.status(200).send({success: true, data: user});
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await findUserById(req.params.id);
    return res.status(200).json({success: true, data: user});
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await findUserById(req.params.id);
    console.log('user is ', user);
    const data = req.body;
    console.log(data);
    const allowedProperties = ['name', 'email', 'password', 'designation', 'mobile', 'department', 'isAdmin'];
    for (const prop in data) {
      if (allowedProperties.includes(prop)) {
        user[prop] = data[prop];
      } else {
        throw utilityError(400, 'additional or incorrect fields are not allowed');
      }
    }
    await user.save();
    return res.status(200).json({success: true, data: user});
  } catch (err) {
    next(err);
  }
};

// export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
//   try {
//     if(!req.body.email || req.body.password)
//     {
//       throw  utilityError(400,"Email or password is missing");
//     }
//     const {email, password} = req.body;
//     const user = await userFindByEmail(email);
//   } catch (error){
//     next(error);
//   }
// }
