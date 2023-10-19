import {app} from './app';
import {server} from './config';

app.listen(server.port, () => {
  console.log(`Application running on port ${server.port}`);
});
