import {app} from './app';
import {server} from './config';
import {logger} from './utils/logger';

app.listen(server.port, () => {
  logger.info(`Application running on port ${server.port}`);
});
