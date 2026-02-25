import {model, models, Schema} from "mongoose";
import {IDepartmentAspirant} from "./type";

const departmentAspirantScheme = new Schema<IDepartmentAspirant>({
  firstName: {type: Schema.Types.String, required: true},
  lastName: {type: Schema.Types.String, required: true},
  middleName: {type: Schema.Types.String, required: true},
  thesisHeadId: {type: Schema.Types.ObjectId, required: true},
  thesisTheme: {type: Schema.Types.String, required: true},
  thesisDate: {type: Schema.Types.Date},
  imagePath: {type: Schema.Types.String},
}, {timestamps: true});

export {departmentAspirantScheme};
export default models?.DepartmentAspirant || model<IDepartmentAspirant>("DepartmentAspirant", departmentAspirantScheme, "department-aspirants");