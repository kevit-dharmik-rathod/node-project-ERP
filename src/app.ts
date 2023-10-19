require('dotenv').config();
import express from 'express';
import {logger} from './utils/logger';
import {server} from './config';
import {Application, Router} from 'express';
export class App {
  public app: Application;
  private routers: Router[];
  constructor(routers: Router[]) {
    this.app = express();
    this.routers = routers;
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.routers.forEach((router) => {
      this.app.use('/', router);
    });
  }

  listen() {
    this.app.listen(server.port, () => {
      logger.info(`Application running on port ${server.port}`);
    });
  }
}
