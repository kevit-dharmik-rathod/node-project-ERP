import {Schema, model} from 'mongoose';

const deptSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  initial: {
    type: String,
    required: true,
    unique: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  occupiedSeats: {
    type: Number,
    default: 0
  }
});

export const Dept = model('Department', deptSchema);
