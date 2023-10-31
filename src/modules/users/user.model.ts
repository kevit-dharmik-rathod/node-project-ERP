require('dotenv').config();
import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {Roles} from '../../interface';
import {logger} from '../../utils/logger';
import {jwtToken} from '../../config';
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  mobile: {
    type: Schema.Types.Number,
    required: true
  },
  department: {
    type: String,
    required: true
    // ref: '
  },
  role: {
    type: String,
    required: true
  },
  authToken: {
    type: String
  }
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({_id: user.id.toString(), role: user.role}, jwtToken.authSecret);
  user.authToken = token;
  return token;
};

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    switch (this.role) {
      case 'ADMIN':
        this.role = Roles.ADMIN;
        break;
      case 'STAFF':
        this.role = Roles.STAFF;
        break;
      default:
        break;
    }
    next();
  } catch (err) {
    throw err;
  }
});

export const User = model('User', userSchema);
