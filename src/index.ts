import {App} from './app';
import {router as pingRouter} from './ping';
import {router as userRouter} from './modules/user.routes';

const app = new App([pingRouter, userRouter]);
app.listen();
