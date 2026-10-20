import {Types} from "mongoose";

export interface ISession {
  _id: string;
  userId: Types.ObjectId;
  expiresAt: Date;
}
