import {App} from './app';
import {router as PingRouter} from './ping';
const app = new App([PingRouter]);
app.listen();
