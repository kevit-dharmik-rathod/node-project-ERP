import {Request, Response, NextFunction} from 'express';
import {body, validationResult} from 'express-validator';
import {utilityError} from '../../utils/utility-error-handler';

export const validatePassword = () => {
  return [
    body('password')
      .exists()
      .withMessage('Password is required')
      .isLength({min: 5})
      .withMessage('Password must be at least 8 characters'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw utilityError(400, errors.array()[0].msg);
      }
      if (Object.keys(req.body).length > 1 || !req.body.hasOwnProperty('password')) {
        // return res.status(400).json({ success:"error", error:"You can change only password"});
        throw utilityError(400, 'You can change only password');
      }
      next();
    }
  ];
};

export const loginCredentials = () => {
  return [
    body('password').exists().withMessage('Invalid credentials'),
    body('email').exists().isEmail().withMessage('Invalid credentials'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw utilityError(400, errors.array());
      }
    }
  ];
};
