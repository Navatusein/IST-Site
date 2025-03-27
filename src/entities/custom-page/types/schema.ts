import {model, models, Schema} from "mongoose";
import {basePageComponentSchema} from "@/entities/base-page-component";
import {ICustomPage} from "./type";

const customPageSchema = new Schema<ICustomPage>({
  path: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  components: [{type: basePageComponentSchema, required: true}],
}, {timestamps: true});

export {customPageSchema};
export default models?.CustomPage || model<ICustomPage>("CustomPage", customPageSchema, "custom-pages");