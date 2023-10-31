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
  generateAuthToken(): any;
}
export interface IStudent extends Document {
  name: string;
  email: string;
  role: string;
  mobile: number;
  password: string;
  department: string;
  sem: number;
  authToken: string;
  generateAuthToken(): any;
}

export interface IDept extends Document {
  name: string;
  initials: string;
  availableSeats: number;
  occupiedSeats: number;
}

export enum Roles {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT'
}
