// user.routes.test.js
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../src/index';
import {logger} from '../src/utils/logger';
import { User } from '../src/modules/users/user.model';
import db from './db.test';

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

describe('profile update by admin by id', () => {
    test('update others profile by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).patch(`/users/update/${db.staff2._id}`).send({
            name:"abhi2",
            password:"abhi123"
        }).set('Authorization', `Bearer ${token}`).expect(400);//because we can update all properties except password
        
    })
     test('update others profile by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).patch(`/users/update/${db.staff2._id}`).send({
            name:"abhinewname",
        }).set('Authorization', `Bearer ${token}`).expect(200);//because we can update all properties except password
    })
})

//get user by id only for admin access
describe('get Users', () => {
    test('should return all users accessed by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).get(`/users/${db.staff2Id}`).set('Authorization', `Bearer ${token}`).expect(200);
        //expect(response.body.data.name).toBe('abhi');//because above we change name from abhi to abhinewname
        expect(response.body.data.name).toBe('abhinewname');
    });
});

//delete user by admin
describe('Trying to delete user', () => {
    test('should delete user by admin', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).delete(`/users/delete/${db.staff2._id}`).set('Authorization', `Bearer ${token}`).expect(200);
        expect(response.body.data).toBe('User deleted successfully');
    });
})

//only access by admin
describe('get Users', () => {
    test('should return all users accessed by admin', async () => {
         const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app).get('/users/').set('Authorization', `Bearer ${token}`).expect(200);
    });
    test('should not return all users because of unauthorized', async () => {
        await request(app).get('/users/').expect(401);
    });
});
 
//credentials which are give in login only that should be used in this read this profile
describe('Read Profile', () => {
    test('Read our profile', async () => {
         const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        const response = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`).expect(200);
        expect(response.body.data.email).toBe('dharmik@gmail.com');
    });

    // this test should be return 500 because here we login as admin and here find staff and here token not present
     test('Read our profile with wrong credentials', async () => {
         const user = await User.findOne({email: db.staff1.email});
        const token = user?.authToken
        const response = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`).expect(500);
    });
});


// when we here logout then others tab will not work properly
describe('user Logout', () => {
    test('user logged out', async () => {
        const user = await User.findOne({email: db.admin.email});
        const token = user?.authToken
        await request(app).post('/users/logout/me').set('Authorization', `Bearer ${token}`).expect(200);
    });
}) 


//when we are login as a staff then we can change only password
describe('user Login', ()=> {
    test('login successfully with correct credentials', async () => {
        await request(app).post('/users/login').send({
             "email":"prit@gmail.com",
            "password":"prit12"
        }).expect(200);
    });
})  
//when we try to change another field then it give error
describe('update our profile', ()=> {
    test('update profile with access ', async () => {
         const user = await User.findOne({email: db.staff1.email});
        const token = user?.authToken
         const response = await request(app).patch('/users/update/me').send({
            password: 'newprit12'
         }).set('Authorization', `Bearer ${token}`).expect(200);
         expect(response.body.data).toBe('password updated successfully');
    })
})