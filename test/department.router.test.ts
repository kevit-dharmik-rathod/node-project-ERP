import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../src/index';
import {logger} from '../src/utils/logger';
import { User } from '../src/modules/users/user.model';
import db from './db';

beforeAll(async () => {
    await db.setUpDatabase(); 
});

//test router
describe('test', () => {
    test('test', async () => {
        await request(app).get('/ping').expect({
            ping: 'pong'
        })
    })
});

describe('user Login', ()=> {
    test('login successfully with correct credentials', async () => {
        await request(app).post('/users/login').send({
             "email":"dharmik@gmail.com",
            "password":"dharmik12"
        }).expect(200);
    });
});

//create new department
describe('create department', () => {
    test('should create department by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
            .post('/depts/add').set('Authorization', `Bearer ${token}`)
            .send(db.dept1)
            .expect(201);
    });
    test('should give 500 because of unauthorized', async () => {
        await request(app)
            .post('/depts/add')
            .send(db.dept2)
            .expect(500);
    });
    test('should created department2', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
            .post('/depts/add')
            .set('Authorization', `Bearer ${token}`)
            .send(db.dept2)
            .expect(201);
    });
}) ;  

describe('getting departments', () => {
    test('should give all departments', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
           .get('/depts/')
           .set('Authorization', `Bearer ${token}`)
           .expect(200);
    });
    test('should give department with its id', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
          .get(`/depts/${db.dept2._id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
    })
})