import {model, models, Schema} from "mongoose";
import {IUser} from "./type";
import bcrypt from "bcryptjs";

const userScheme = new Schema<IUser>({
  login: {type: String, required: true, unique: true},
  passwordHash: {type: String},
  name: {type: String, required: true},
  permissions: {type: [String], enum: ["edit-news", "edit-pages", "edit-users", "edit-files"]}
}, {timestamps: true});

userScheme.methods.setPassword = async function (password: string) {
  this.passwordHash = await bcrypt.hash(password, 10);
}

export {userScheme};
export default models?.User || model<IUser>("User", userScheme, "users");