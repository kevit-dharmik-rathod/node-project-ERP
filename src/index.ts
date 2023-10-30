import {App} from './app';
import {router as pingRouter} from './ping';
import {router as userRouter} from './modules/users/user.routes';
import {router as studentRouter} from './modules/students/student.routes';

const app = new App([pingRouter, userRouter, studentRouter]);
app.listen();
