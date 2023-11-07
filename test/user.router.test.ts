import request from 'supertest';
import {app} from '../src/index';
import { authentication } from '../src/middleware/authenticate';
import { authorization } from '../src/middleware/authorization';

test('simple ping router', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ping: 'pong' });
});

// const userData = {
//      "name": "dharmik",
//     "email":"dharmik@gmail.com",
//     "password": "dharmik12",
//     "designation": "Head of department",
//     "mobile": 6361775548,
//     "department": "CE",
//     "role":"ADMIN"
// }

// describe('create user', () => {
//    test('should create new user', async () => {
//     await request(app).post('/users/signup').send(userData).set('Accept', 'application/json').expect(201);
//    })
// })

describe('create new user', () => {
    test('should create a new user', async() => {
        await request(app).post('/users/signup')
    })
})
