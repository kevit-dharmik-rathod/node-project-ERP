import {App} from './app';
import {router as PingRouter} from './ping';
import {router as userRouter} from './modules/user.routes';

const app = new App([PingRouter, userRouter]);
app.listen();
