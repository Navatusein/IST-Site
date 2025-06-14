import {model, models, Schema} from "mongoose";
import {IDepartmentStaff} from "./type";

const departmentStaffScheme = new Schema<IDepartmentStaff>({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  middleName: {type: String, required: true},
  email: {type: String, required: true},
  position: {type: String, required: true},
  imagePath: {type: String},
  path: {type: String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
}, {timestamps: true});

export {departmentStaffScheme};
export default models?.DepartmentStaff || model<IDepartmentStaff>("DepartmentStaff", departmentStaffScheme, "department-staff");