import {model, models, Schema} from "mongoose";
import {IDepartmentStaff} from "./type";

const departmentStaffScheme = new Schema<IDepartmentStaff>({
  firstName: {type: Schema.Types.String, required: true},
  lastName: {type: Schema.Types.String, required: true},
  middleName: {type: Schema.Types.String, required: true},
  email: {type: Schema.Types.String, required: true},
  position: {type: Schema.Types.String, required: true},
  imagePath: {type: Schema.Types.String},
  path: {type: Schema.Types.String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
  profiles: [{type: Schema.Types.Mixed, required: true}]
}, {timestamps: true});

export {departmentStaffScheme};
export default models?.DepartmentStaff || model<IDepartmentStaff>("DepartmentStaff", departmentStaffScheme, "department-staff");