import {model, models, Schema} from "mongoose";
import {INews} from "./type";

const newsScheme = new Schema<INews>({
  title: {type: String, required: true},
  description: {type: String, required: true},
  imagePath: {type: String},
  path: {type: String, required: true, unique: true},
  components: [{type: Schema.Types.Mixed, required: true}],
  date: {type: String, required: true},
}, {timestamps: true});

export {newsScheme};
export default models?.News || model<INews>("News", newsScheme, "news");