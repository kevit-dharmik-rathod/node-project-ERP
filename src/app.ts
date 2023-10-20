require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import {logger} from './utils/logger';
import {server} from './config';
import {Application, Router} from 'express';
import {mongoConfig} from './config';
export class App {
  public app: Application;
  private routers: Router[];
  constructor(routers: Router[]) {
    this.app = express();
    this.routers = routers;
    this.mongoSetup();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }
  initializeMiddlewares() {
    this.app.use(express.json());
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

  mongoSetup(): void {
    mongoose.connection.on('connected', () => {
      logger.info('Database connected...!');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Database error : ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Database disconnected...!');
    });

    mongoose.connect(`${mongoConfig.mongoUrl}${mongoConfig.dbName}`);
  }
}
