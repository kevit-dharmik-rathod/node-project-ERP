import {Schema, model} from 'mongoose';

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
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Department'
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  authToken: {
    type: String
  }
});

export const User = model('User', userSchema);
