import {model, models, Schema} from "mongoose";
import {IUser} from "./type";
import bcrypt from "bcryptjs";

const userScheme = new Schema<IUser>({
  login: {type: Schema.Types.String, required: true, unique: true},
  passwordHash: {type: Schema.Types.String},
  name: {type: Schema.Types.String, required: true},
  permissions: {type: [Schema.Types.String]}
}, {timestamps: true});

userScheme.methods.setPassword = async function (password: string) {
  this.passwordHash = await bcrypt.hash(password, 10);
}

export {userScheme};
export default models?.User || model<IUser>("User", userScheme, "users");