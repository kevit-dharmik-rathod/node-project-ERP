import {NextFunction, Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import {createNewUser, findUserById, getAllUsers, userFindByEmail, deleteUser} from '../users/user.services';
import {utilityError} from '../../utils/utility-error-handler';
import {logger} from '../../utils/logger';

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
    const user = await createNewUser(req.body);
    if (!user) {
      throw utilityError(400, 'either email id already present or fields are missing or incorrect');
    }
    return res.status(201).send({success: true, data: user});
  } catch (err) {
    logger.error(`Error while creating user: ${err} `);
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      throw utilityError(404, 'User not exist with this id');
    }
    return res.status(200).json({success: true, data: user});
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      throw utilityError(404, 'User not exist with this id');
    }
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

export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    if (!req.body.email || !req.body.password) {
      throw utilityError(400, 'Email or password is missing');
    }
    const {email, password} = req.body;
    const user = await userFindByEmail(email);
    if (!user) {
      throw utilityError(404, "User doesn't exist");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const token = await user.generateAuthToken();
      user.authToken = token;
      await user.save();
    } else {
      throw utilityError(400, 'password not matching');
    }
    return res.status(200).send({success: true, data: user});
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await findUserById(req['auth']._id);
    if (!user) {
      throw utilityError(404, 'User not exist with this id');
    }
    user.authToken = undefined;
    await user.save();
    return res.status(200).send({success: true, data: 'Successfully log out'});
  } catch (err) {
    logger.error(`Error while logging out ${err}`);
    next(err);
  }
};

export const deleteUserById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const user = await deleteUser(req.params.id);
    if (!user) {
      throw utilityError(404, 'User not exist with this id');
    }
    return res.status(200).json({success: true, data: 'User deleted successfully'});
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id} = req['auth'];
    const user = await findUserById(_id);
    if (!user) {
      throw utilityError(404, 'User not found or you are not authorized for access this profile');
    }
    return res.status(200).send({success: true, data: user});
  } catch (err) {
    logger.error(`Error while get own profile ${err}`);
    next(err);
  }
};

export const updateOwnProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  try {
    const {_id, role} = req['auth'];
    const user = await findUserById(_id);
    if (!user) {
      throw utilityError(400, 'User not exist with this id');
    }
    const data = req.body;
    const allowedProperties = ['password'];
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
    logger.error(`Error while updating own profile ${err}`);
    next(err);
  }
};
