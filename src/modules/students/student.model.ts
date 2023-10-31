require('dotenv').config();
import {Schema, model} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {Roles} from '../../interface';
import {utilityError} from '../../utils/utility-error-handler';
import {logger} from '../../utils/logger';
import {jwtToken} from '../../config';

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: Roles.STUDENT
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    required: true
  },
  sem: {
    type: Number,
    required: true
  },
  authToken: {
    type: String
  }
});

studentSchema.methods.toJSON = function () {
  const student = this;
  const studentObject = student.toObject();
  delete studentObject.password;
  return studentObject;
};

studentSchema.methods.generateAuthToken = async function () {
  const student = this;
  const token = jwt.sign({_id: student.id.toString(), role: student.role}, jwtToken.authSecret);
  student.authToken = token;
  return token;
};

studentSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    if (this.isModified('role') && this.role !== Roles.STUDENT) {
      throw utilityError(400, 'Enter valid role');
    }
    next();
  } catch (err) {
    logger.info(`Error occurred while saving student: ${err}`);
    next(err);
  }
});

export const Student = model('Student', studentSchema);
