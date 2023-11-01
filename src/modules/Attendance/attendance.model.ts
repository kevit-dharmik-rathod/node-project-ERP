import {Schema, model} from 'mongoose';

const attendanceSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Student'
  },
  date: {
    type: Schema.Types.Date,
    required: true
  },
  isPresent: {
    type: Boolean,
    required: true
  }
});

export const Attendance = model('Attendance', attendanceSchema);
