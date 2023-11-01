import {Schema, model} from 'mongoose';
import {Student} from '../../modules/students/student.model';
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
  },
  batch: {
    type: Number,
    required: true
  }
});

deptSchema.post('findOneAndDelete', async function (_id: string) {
  await Student.deleteMany({department: _id});
});
export const Dept = model('Department', deptSchema);
