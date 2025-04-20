import {model, models, Schema} from "mongoose";
import {IPublicMenuItem} from "./type";

const publicMenuItemScheme = new Schema<IPublicMenuItem>({
  label: {type: String, required: true},
  parent: {type: String, required: true},
  index: {type: Number, required: true},
  path: {type: String}
}, {timestamps: true});

export {publicMenuItemScheme};
export default models?.PublicMenuItem || model<IPublicMenuItem>("PublicMenuItem", publicMenuItemScheme, "public-menu-items");