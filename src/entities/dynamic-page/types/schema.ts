import {model, models, Schema} from "mongoose";
import {basePageComponentSchema} from "@/entities/base-page-component";
import {IDynamicPage} from "./type";

const dynamicPageSchema = new Schema<IDynamicPage>({
  path: {type: String, required: true, unique: true},
  title: {type: String, required: true},
  components: [{type: basePageComponentSchema, required: true}],
}, {timestamps: true});

export {dynamicPageSchema};
export default models?.DynamicPage || model<IDynamicPage>("DynamicPage", dynamicPageSchema, "dynamic-pages");