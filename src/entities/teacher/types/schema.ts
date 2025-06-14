import {model, models, Schema} from "mongoose";
import {ITeacher} from "./type";

const teacherScheme = new Schema<ITeacher>({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  middleName: {type: String, required: true},
  email: {type: String, required: true},
  position: {type: String, required: true},
  imagePath: {type: String},
  path: {type: String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
}, {timestamps: true});

export {teacherScheme};
export default models?.Teacher || model<ITeacher>("Teacher", teacherScheme, "teachers");