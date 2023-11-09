import request from 'supertest';
import { app } from '../src/index';
import { User } from '../src/modules/users/user.model';
import db from './db';

beforeAll(async () => {
    await db.setUpDatabase(); 
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
    });
});

describe('update department', () => {
    test('should update department only by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).patch(`/depts/update/${db.dept2._id}`).send({
            name: "Fundamentals of Electrical Engineering",
            batch: 2024
        }).set('Authorization', `Bearer ${token}`).expect(200);
        expect(response.body.data.name).toBe('Fundamentals of Electrical Engineering');
    });
});
describe('delete department by admin', () => {
    test('should delete department with it"s id', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).delete(`/depts/delete/${db.dept2._id}`).set('Authorization', `Bearer ${token}`).expect(200).expect(200);
        expect(response.body.data).toBe('Department deleted successfully')
    });
})
describe('create staff and user by admin', () => {
    test('should create user by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
            .post('/users/signup').set('Authorization', `Bearer ${token}`)
            .send(db.staff1)
            .expect(201);
    });
    test('should create user by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app)
            .post('/users/signup').set('Authorization', `Bearer ${token}`)
            .send(db.staff2)
            .expect(201);
    });
}) ;

describe('user Logout', () => {
    test('user logged out', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app).post('/users/logout/me').set('Authorization', `Bearer ${token}`).expect(200);
    });
});

describe('user Login', ()=> {
    test('login successfully with correct credentials', async () => {
        await request(app).post('/users/login').send({
             email: "abhi@gmail.com",
            password: "abhi12",
        }).expect(200);
    });
});

describe('getting department as staff', () => {
    test('should give 500 because of getting department as a staff', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app) .get(`/depts/${db.dept2._id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(500);
    })
})

