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
export const getAndDelete = async (_id: string): Promise<IDept> => {
  try {
    return await Dept.findOneAndDelete({_id});
  } catch (err) {
    logger.error(`Error in dept service while deleting dept by id: ${err}`);
    throw utilityError(500, err);
  }
};

export const task1 = async () => {
  try {
    const pipeLine = [
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

export const task2 = async (body: object) => {
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
            mobieNo: '$studentDetails.mobile',
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
