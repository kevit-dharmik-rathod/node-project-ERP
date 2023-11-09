// db.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../src/modules/users/user.model';
import { jwtToken } from '../src/config';
import { Dept } from '../src/modules/departments/department.model'

const adminId = new mongoose.Types.ObjectId();
const staff1Id = new mongoose.Types.ObjectId();
const staff2Id = new mongoose.Types.ObjectId();
const dept1Id = new mongoose.Types.ObjectId();
const dept2Id = new mongoose.Types.ObjectId();

const admin = {
    _id: adminId,
    name: "dharmik",
    email: "dharmik@gmail.com",
    password: "dharmik12",
    designation: "Head of department",
    mobile: 6361775548,
    department: "CE",
    role: "ADMIN",
    authToken: jwt.sign({_id : adminId.toString(), role: "ADMIN"}, jwtToken.authSecret)
}

const staff1 = {
    _id: staff1Id,
    name: "prit",
    email: "prit@gmail.com",
    password: "prit12",
    designation: "Professor",
    mobile: 6361775548,
    department: "CE",
    role: "STAFF"
}

const staff2 = {
    _id: staff2Id,
    name: "abhi",
    email: "abhi@gmail.com",
    password: "abhi12",
    designation: "Professor",
    mobile: 6361775548,
    department: "CE",
    role: "STAFF"
}

const dept1 = {
    _id: dept1Id,
    name: "Computer Engineering",
    initial: "CE-2023",
    availableSeats: 5,
    occupiedSeats: 0,
    batch: 2023
}

const dept2 = {
    _id: dept2Id,
    name: "Electrical Engineering",
    initial: "EE-2023",
    availableSeats: 5,
    occupiedSeats: 0,
    batch: 2023
}
const setUpDatabase = async () => {
    // Check if the admin user already exists in the database
    const existingAdmin = await User.findOne({ email: admin.email });
    if (!existingAdmin) {
        // If not, save the admin user
        await User.create(admin);
    }
    // Delete other users
    await User.deleteMany({ email: { $ne: admin.email } });
    await Dept.deleteMany();
} 

export default {
    setUpDatabase,
    admin,
    staff1,
    adminId,
    staff2,
    staff2Id,
    dept1,
    dept1Id,
    dept2,
    dept2Id
}
