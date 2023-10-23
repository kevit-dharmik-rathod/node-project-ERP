import {Schema, model} from 'mongoose';
import bcrypt from 'bcryptjs';

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
  isAdmin: {
    type: Boolean,
    required: true
  },
  authToken: {
    type: String
  }
});

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    throw err;
  }
});

export const User = model('User', userSchema);
