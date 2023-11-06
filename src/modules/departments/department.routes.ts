import {Router} from 'express';
import {authentication} from '../../middleware/authenticate';
import {authorization} from '../../middleware/authorization';
import {
  createDepartment,
  deleteDept,
  getDepartment,
  getDepartments,
  query1,
  query2,
  updateDepartment
} from './department.controllers';

const route = 'depts';
export const router = Router();

//Query1
router.get(`/${route}/query1`, authentication, authorization(['ADMIN']), query1);

//Query2
router.post(`/${route}/query2`, authentication, authorization(['ADMIN', 'STAFF']), query2);

//get All Departments
router.get(`/${route}/`, authentication, authorization(['ADMIN']), getDepartments);

//create new department
router.post(`/${route}/add`, authentication, authorization(['ADMIN']), createDepartment);

//get Department by id
router.get(`/${route}/:id`, authentication, authorization(['ADMIN']), getDepartment);

//update deparment
router.patch(`/${route}/update/:id`, authentication, authorization(['ADMIN']), updateDepartment);

//delete department
router.delete(`/${route}/delete/:id`, authentication, authorization(['ADMIN']), deleteDept);

//query3
// [
//   {
//     $lookup:
//       /**
//        * from: The target collection.
//        * localField: The local join field.
//        * foreignField: The target join field.
//        * as: The name for the results.
//        * pipeline: Optional pipeline to run on the foreign collection.
//        * let: Optional variables to use in the pipeline field stages.
//        */
//       {
//         from: "students",
//         localField: "_id",
//         foreignField: "department",
//         as: "studentDetails",
//       },
//   },
//   {
//     $unwind:
//       /**
//        * path: Path to the array field.
//        * includeArrayIndex: Optional name for index.
//        * preserveNullAndEmptyArrays: Optional
//        *   toggle to unwind null and empty values.
//        */
//       {
//         path: "$studentDetails",
//       },
//   },
//   {
//     $lookup:
//       /**
//        * from: The target collection.
//        * localField: The local join field.
//        * foreignField: The target join field.
//        * as: The name for the results.
//        * pipeline: Optional pipeline to run on the foreign collection.
//        * let: Optional variables to use in the pipeline field stages.
//        */
//       {
//         from: "attendances",
//         localField: "studentDetails._id",
//         foreignField: "studentId",
//         as: "attendance",
//       },
//   },
//   {
//     $unwind:
//       /**
//        * path: Path to the array field.
//        * includeArrayIndex: Optional name for index.
//        * preserveNullAndEmptyArrays: Optional
//        *   toggle to unwind null and empty values.
//        */
//       {
//         path: "$attendance",
//       },
//   },
//   {
//     $project:
//       /**
//        * specifications: The fields to
//        *   include or exclude.
//        */
//       {
//         _id: 0,
//         studentId: "$studentDetails._id",
//         name: "$studentDetails.name",
//         department: "$name",
//         year: "$batch",
//         date: "$attendance.date",
//         present: "$attendance.isPresent",
//       },
//   },
//   {
//     $match: {
//       date: {
//         $lte: ISODate(
//           "2023-10-05T00:00:00.000+00:00"
//         ),
//       },
//     },
//   },
//   {
//     $group:
//       /**
//        * newField: The new field name.
//        * expression: The new field expression.
//        */
//       {
//         _id: "$studentId",
//         totalAttendances: {
//           $sum: 1,
//         },
//         actualAttendances: {
//           $sum: {
//             $cond: ["$present", 1, 0],
//           },
//         },
//         name: {
//           $first: "$name",
//         },
//       },
//   },
// ]
