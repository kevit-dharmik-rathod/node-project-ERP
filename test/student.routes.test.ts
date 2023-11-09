import db from './db.test';
import request from 'supertest';
import {logger} from '../src/utils/logger';
import { app } from '../src/index';
import { User } from '../src/modules/users/user.model';
import { Dept } from '../src/modules/departments/department.model';
import { Student } from '../src/modules/students/student.model';
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
             "email":"prit@gmail.com",
            "password":"prit12"
        }).expect(200);
    });
});

describe('add student by admin or staff', () => {
    test('should create student add in to database', async () => {
        const user = await User.findOne(db.staff1Id);
        const token = user?.authToken
        const response = await request(app).post('/students/signup').send(db.student1).set('Authorization', `Bearer ${token}`).expect(201)
        // expect(response.body.data.name).toBe('keval');
    });
    test('should create student add in to database', async () => {
        const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        const response = await request(app).post('/students/signup').send(db.student2).set('Authorization', `Bearer ${token}`).expect(201)
        // expect(response.body.data.name).toBe('kunj');
    })
});

describe('update student profile by admin', () => {
    test('update student', async () => {
        const dept1 = await Dept.findById(db.dept1Id);
        const newId = dept1?._id;
        const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app).patch(`/students/${db.student2._id}`).send({
            department: newId
        }).set('Authorization', `Bearer ${token}`).expect(200);
    })
})

// describe('user Logout', () => {
//     test('user logged out', async () => {
//         const user = await User.findOne({email: db.staff1.email});
//         const token = user?.authToken
//         await request(app).post('/users/logout/me').set('Authorization', `Bearer ${token}`).expect(200);
//     });
// });

// describe('user Login', ()=> {
//     test('login successfully with correct credentials', async () => {
//         await request(app).post('/students/login').send({
//              "email":"kunj@gmail.com",
//             "password":"kunj12"
//         }).expect(200);
//     });
// });

// describe('update self student', () => {
//     test('update student itself only allow password change', async () => {
//         const user = await Student.findById(db.student2Id);
//         const token = user?.authToken
//         await request(app).patch('/students/update/me').send({
//             password: "kunj123",
//             name: "newKunj"
//         }).set('Authorization', `Bearer ${token}`).expect(400);
//     });
// });

describe('get student by id ', () => {
    test('get student by id', async () => {
        const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app).get(`/students/${db.student2Id}`).set('Authorization', `Bearer ${token}`).expect(200);
    })
});

//Attendance
describe('add attendance', () => {
    test('Add attendance of student 1', async () => {
       const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .post('/attendance/add').set('Authorization', `Bearer ${token}`)
            .send(db.attendance1)
            .expect(201);
    })
    test('Add attendance of student 1', async () => {
       const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .post('/attendance/add').set('Authorization', `Bearer ${token}`)
            .send(db.attendance2)
            .expect(201);
    })
});

describe('get attendance', () => {
    test('Add All attendances', async () => {
       const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .get('/attendance/all').set('Authorization', `Bearer ${token}`)
            .expect(200);
    });
    test('get All attendances of student 1', async () => {
       const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .get(`/attendance/student/${db.student1Id}`).set('Authorization', `Bearer ${token}`)
            .expect(200);
    })
});

describe('all student delete', () => {
    test('Delete student 1 ', async () => {
        const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .delete(`/students/${db.student1Id}`).set('Authorization', `Bearer ${token}`)
            .expect(200);
    });
    test('Delete student 2 ', async () => {
        const user = await User.findById(db.staff1Id);
        const token = user?.authToken
        await request(app)
            .delete(`/students/${db.student2Id}`).set('Authorization', `Bearer ${token}`)
            .expect(200);
    });
})