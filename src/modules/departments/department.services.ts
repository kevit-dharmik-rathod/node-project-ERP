import {Dept} from './department.model';
import {IDept} from '../../interface';
import {logger} from '../../utils/logger';
import {utilityError} from '../../utils/utility-error-handler';

/**
 * get all departments
 * @returns {Promise<IDept>} => return promise with array of departments
 */
export const getAllDept = async (): Promise<IDept[]> => {
  try {
    return await Dept.find();
  } catch (err) {
    logger.error(`Error in dept service while finding all depts: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * create new department
 * @param dept => req.body object passed as dept object
 * @returns {Promise<object>} => return promise with dept object
 */
export const CreateNewDepartment = async (dept: object): Promise<object> => {
  try {
    return await Dept.create(dept);
  } catch (err) {
    logger.error(`Error in services while creating new department ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * get dept by it's id
 * @param id => dept id
 * @returns {Promise<IDept>} => return a promise of dept object
 */
export const getDeptById = async (_id: string): Promise<IDept> => {
  try {
    return await Dept.findById(_id);
  } catch (err) {
    logger.error(`Error in dept service while finding dept by id: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * find and delete dept by it's id
 * @param id
 * @returns {Promise<IDept>} => return a promise with IDept object
 */
export const getAndDelete = async (_id: string): Promise<string> => {
  try {
    const dept = await Dept.findOneAndDelete({_id});
    if (!dept) {
      throw new Error(`dept with id ${_id} not found`);
    }
    return 'deleted successfully';
  } catch (err) {
    logger.error(`Error in dept service while deleting dept by id: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * for getting year, totalStudents and branch wise total students
 * @returns {Promise<object[]>} => return a promise with array of objects
 */
export const task1 = async (): Promise<object[]> => {
  try {
    const pipeLine: any = [
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: '$batch',
            totalStudents: {
              $sum: '$occupiedSeats'
            },
            branches: {
              $push: {
                initial: '$initial',
                occupiedSeats: '$occupiedSeats'
              }
            }
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            department: {
              $map: {
                input: '$branches',
                as: 'tempData',
                in: {
                  k: '$$tempData.initial',
                  v: '$$tempData.occupiedSeats'
                }
              }
            },
            totalStudents: 1
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            year: '$_id',
            branches: {
              $arrayToObject: '$department'
            },
            totalStudents: 1
          }
      }
    ];
    return await Dept.aggregate(pipeLine);
  } catch (err) {
    logger.error(`Error in services while task1 performed : ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * for getting list of students absent on specific day
 * @param body => request body of type object
 * @returns {Promise<object[]>} => return a promise with array of objects
 */
export const task2 = async (body: object): Promise<object[]> => {
  try {
    const pipeLine: any = [
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'students',
            localField: '_id',
            foreignField: 'department',
            as: 'studentDetails'
          }
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$studentDetails'
          }
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'attendances',
            localField: 'studentDetails._id',
            foreignField: 'studentId',
            as: 'attendance'
          }
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$attendance'
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            name: '$studentDetails.name',
            email: '$studentDetails.email',
            mobileNo: '$studentDetails.mobile',
            branch: '$name',
            sem: '$studentDetails.sem',
            batch: 1,
            date: '$attendance.date',
            present: '$attendance.isPresent'
          }
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            date: new Date(body['date']),
            present: false
          }
      }
    ];
    if (body.hasOwnProperty('batch')) {
      pipeLine.push({
        $match: {
          batch: body['batch']
        }
      });
    }
    if (body.hasOwnProperty('branch')) {
      pipeLine.push({
        $match: {
          branch: body['branch']
        }
      });
    }
    if (body.hasOwnProperty('sem')) {
      pipeLine.push({
        $match: {
          branch: body['sem']
        }
      });
    }
    return await Dept.aggregate(pipeLine);
  } catch (err) {
    logger.error(`Error in services while getting absent students: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * for getting list of student which attendance is less than 75% up to date which we give as a input.
 * @param body => request body of type object
 * @returns {Promise<object[]>} => return a promise with array of objects
 */
export const task3 = async (body: object): Promise<object[]> => {
  try {
    const pipeLine: any = [
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'students',
            localField: '_id',
            foreignField: 'department',
            as: 'studentDetails'
          }
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$studentDetails'
          }
      },
      {
        $lookup:
          /**
           * from: The target collection.
           * localField: The local join field.
           * foreignField: The target join field.
           * as: The name for the results.
           * pipeline: Optional pipeline to run on the foreign collection.
           * let: Optional variables to use in the pipeline field stages.
           */
          {
            from: 'attendances',
            localField: 'studentDetails._id',
            foreignField: 'studentId',
            as: 'attendance'
          }
      },
      {
        $unwind:
          /**
           * path: Path to the array field.
           * includeArrayIndex: Optional name for index.
           * preserveNullAndEmptyArrays: Optional
           *   toggle to unwind null and empty values.
           */
          {
            path: '$attendance'
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            branch: '$name',
            sem: '$studentDetails.sem',
            studentId: '$studentDetails._id',
            name: '$studentDetails.name',
            email: '$studentDetails.email',
            mobile: '$studentDetails.mobile',
            department: '$name',
            year: '$batch',
            date: '$attendance.date',
            present: '$attendance.isPresent'
          }
      },
      {
        $match: {
          date: {
            $lte: new Date(body['date'])
          }
        }
      },
      {
        $group:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            _id: '$studentId',
            totalAttendances: {
              $sum: 1
            },
            actualAttendances: {
              $sum: {
                $cond: ['$present', 1, 0]
              }
            },
            name: {
              $first: '$name'
            },
            email: {
              $first: '$email'
            },
            mobile: {
              $first: '$mobile'
            },
            batch: {
              $first: '$year'
            },
            branch: {
              $first: '$branch'
            },
            sem: {
              $first: '$sem'
            }
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            studentId: '$_id',
            name: 1,
            email: 1,
            mobile: 1,
            sem: 1,
            branch: 1,
            batch: 1,
            attendancePercentage: {
              $multiply: [
                {
                  $divide: ['$actualAttendances', '$totalAttendances']
                },
                100
              ]
            }
          }
      },
      {
        $match:
          /**
           * query: The query in MQL.
           */
          {
            attendancePercentage: {
              $lt: 75
            }
          }
      }
    ];
    if (body.hasOwnProperty('batch')) {
      pipeLine.push({
        $match: {
          batch: body['batch']
        }
      });
    }
    if (body.hasOwnProperty('branch')) {
      pipeLine.push({
        $match: {
          branch: body['branch']
        }
      });
    }
    if (body.hasOwnProperty('sem')) {
      pipeLine.push({
        $match: {
          branch: body['sem']
        }
      });
    }
    return await Dept.aggregate(pipeLine);
  } catch (err) {
    logger.error(`Error in services while fetching records for task3: ${err}`);
    throw utilityError(500, err);
  }
};

/**
 * getting vacant seats year wise
 * @param body => request body of type object
 * @returns {Promise<object[]>} => return a promise with array of objects
 */
export const task4 = async (body: object): Promise<object[]> => {
  try {
    const pipeLine: any = [
      {
        $group:
          /**
           * _id: The id of the group.
           * fieldN: The first field name.
           */
          {
            _id: '$batch',
            totalStudents: {
              $sum: '$occupiedSeats'
            },
            totalStudentsIntake: {
              $sum: '$availableSeats'
            },
            makeBranches: {
              $push: {
                name: '$initial',
                totalStudents: '$availableSeats',
                totalStudentsIntake: '$occupiedSeats',
                availableIntake: {
                  $subtract: ['$availableSeats', '$occupiedSeats']
                }
              }
            }
          }
      },
      {
        $project:
          /**
           * newField: The new field name.
           * expression: The new field expression.
           */
          {
            _id: 0,
            batch: '$_id',
            totalStudents: 1,
            totalStudentsIntake: 1,
            branches: {
              $map: {
                input: '$makeBranches',
                as: 'data',
                in: {
                  k: '$$data.name',
                  v: {
                    totalStudents: '$$data.totalStudents',
                    totalStudentsIntake: '$$data.totalStudentsIntake',
                    availableIntake: '$$data.availableIntake'
                  }
                }
              }
            }
          }
      },
      {
        $project:
          /**
           * specifications: The fields to
           *   include or exclude.
           */
          {
            _id: 0,
            batch: '$batch',
            totalStudents: 1,
            totalStudentsIntake: 1,
            branches: {
              $arrayToObject: '$branches'
            }
          }
      }
    ];
    if (body.hasOwnProperty('batch')) {
      pipeLine.unshift({
        $match: {
          batch: body['batch']
        }
      });
    }
    if (body.hasOwnProperty('branch')) {
      pipeLine.unshift({
        $match: {
          initial: body['branch']
        }
      });
    }
    return await Dept.aggregate(pipeLine);
  } catch (err) {
    logger.error(`Error in services while Get a list of vacant seat’s year wise: ${err}`);
    throw utilityError(500, err);
  }
};
