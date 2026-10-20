import {model, models, Schema} from "mongoose";
import {ISession} from "./type";

const sessionScheme = new Schema<ISession>({
  _id: {type: Schema.Types.String, required: true},
  userId: {type: Schema.Types.ObjectId, required: true, index: true},
  expiresAt: {type: Schema.Types.Date, required: true, expires: 0},
}, {timestamps: true});

export {sessionScheme};
export default models?.Session || model<ISession>("Session", sessionScheme, "sessions");
