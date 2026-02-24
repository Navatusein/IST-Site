import {model, models, Schema} from "mongoose";
import {INews} from "./type";

const newsScheme = new Schema<INews>({
  title: {type: Schema.Types.String, required: true},
  description: {type: Schema.Types.String, required: true},
  imagePath: {type: Schema.Types.String},
  path: {type: Schema.Types.String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
  date: {type: Schema.Types.String, required: true},
}, {timestamps: true});

export {newsScheme};
export default models?.News || model<INews>("News", newsScheme, "news");