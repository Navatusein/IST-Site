import {model, models, Schema} from "mongoose";
import {basePageComponentSchema} from "@/entities/base-page-component";
import {IDynamicPage} from "./type";

const dynamicPageSchema = new Schema<IDynamicPage>({
  name: {type: String, required: true},
  title: {type: String, required: true},
  path: {type: String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
}, {timestamps: true});

export {dynamicPageSchema};
export default models?.DynamicPage || model<IDynamicPage>("DynamicPage", dynamicPageSchema, "dynamic-pages");