import {model, models, Schema} from "mongoose";
import {IDynamicPage} from "./type";

const dynamicPageSchema = new Schema<IDynamicPage>({
  name: {type: Schema.Types.String, required: true},
  title: {type: Schema.Types.String, required: true},
  path: {type: Schema.Types.String, required: true, unique: true},
  entities: [{type: Schema.Types.Mixed, required: true}],
}, {timestamps: true});

export {dynamicPageSchema};
export default models?.DynamicPage || model<IDynamicPage>("DynamicPage", dynamicPageSchema, "dynamic-pages");