// db.js
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../src/modules/users/user.model';
import { jwtToken } from '../src/config';

const adminId = new mongoose.Types.ObjectId();
const staff1Id = new mongoose.Types.ObjectId();
const staff2Id = new mongoose.Types.ObjectId();

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
const setUpDatabase = async () => {
    // Check if the admin user already exists in the database
    const existingAdmin = await User.findOne({ email: admin.email });
    if (!existingAdmin) {
        // If not, save the admin user
        await User.create(admin);
    }
    // Delete other users
    await User.deleteMany({ email: { $ne: admin.email } });
} 

export default {
    setUpDatabase,
    admin,
    staff1,
    adminId,
    staff2,
    staff2Id
}
