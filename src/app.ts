import dotenv from 'dotenv';
import express, {Application} from 'express';

dotenv.config();

export const app: Application = express();
