import {Document} from "mongoose";

export interface IUser extends Document {
  login: string,
  passwordHash: string,
  name: string
}