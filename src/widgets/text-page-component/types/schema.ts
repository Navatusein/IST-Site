import {CustomPageModel, customPageSchema} from "@/entities/custom-page";
import {models, Schema} from "mongoose";

const textPageComponentSchema = new Schema({
  content: {type: String, required: true},
}, {_id: false});

export {textPageComponentSchema}
export default models?.CustomPage?.discriminators?.text || customPageSchema.path<Schema.Types.Subdocument>("components").discriminator("text", textPageComponentSchema);