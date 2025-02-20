import {model, models, Schema} from "mongoose";
import {IUser} from "./type";
import bcrypt from "bcryptjs";

const userScheme = new Schema<IUser>({
  login: {type: String, required: true},
  passwordHash: {type: String, required: true},
  name: {type: String, required: true}
}, {timestamps: true});

userScheme.methods.setPassword = async function (password: string) {
  this.passwordHash = await bcrypt.hash(password, 10);
}

export default models?.User || model<IUser>("User", userScheme, "users");