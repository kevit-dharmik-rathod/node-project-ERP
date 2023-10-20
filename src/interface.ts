import {Document} from 'mongoose';
export interface IUser extends Document {
  name: string;
  isAdmin: boolean;
  designation: string;
  email: string;
  mobile: number;
  password: string;
  department: string;
  authToken: string;
}