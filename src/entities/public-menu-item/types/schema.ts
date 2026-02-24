import {model, models, Schema} from "mongoose";
import {IPublicMenuItem} from "./type";

const publicMenuItemScheme = new Schema<IPublicMenuItem>({
  label: {type: Schema.Types.String, required: true},
  parent: {type: Schema.Types.ObjectId, required: true},
  index: {type: Schema.Types.Number, required: true},
  path: {type: Schema.Types.String}
}, {timestamps: true});

export {publicMenuItemScheme};
export default models?.PublicMenuItem || model<IPublicMenuItem>("PublicMenuItem", publicMenuItemScheme, "public-menu-items");