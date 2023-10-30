import {Router} from 'express';
export const router = Router();

router.get('/ping', (req, res) => {
  res.send({ping: 'pong'});
});
