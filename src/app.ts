require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {ErrorHandler} from './middleware/error-handler';
import {logger} from './utils/logger';
import {server} from './config';
import {Application, Router} from 'express';
import {mongoConfig} from './config';

const corsConfig = {
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'Accept',
    'Host',
    'User-Agent',
    'Content-Type',
    'Connection',
    'Accept-Encoding',
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
export class App {
  public app: Application;
  private routers: Router[];
  constructor(routers: Router[]) {
    this.app = express();
    this.routers = routers;
    this.mongoSetup();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeError();
  }
  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors(corsConfig));
  }

  initializeRoutes() {
    this.routers.forEach((router) => {
      this.app.use('/', router);
    });
  }
  initializeError() {
    this.app.use(ErrorHandler);
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
