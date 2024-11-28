import {App} from './app';
import {router as pingRouter} from './ping';
import {router as userRouter} from './modules/users/user.routes';
import {router as studentRouter} from './modules/students/student.routes';
import {router as deptRouter} from './modules/departments/department.routes';
import {router as attendanceRouter} from './modules/Attendance/attendance.routes';

//only for testing purposes
const appInstance = new App([pingRouter, userRouter, studentRouter, deptRouter, attendanceRouter]);

export const app = appInstance.app;
