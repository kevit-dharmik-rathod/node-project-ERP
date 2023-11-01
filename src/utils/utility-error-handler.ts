import {ValidationError} from 'express-validator';
export const utilityError = (code: number, error: Error | string | ValidationError[]): Error => {
  return new Error(JSON.stringify({code, error}));
};
