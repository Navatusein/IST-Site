import {model, models, Schema} from "mongoose";
import {IFileEntryDocument} from "./type";

const fileEntryScheme = new Schema<IFileEntryDocument>({
  slug: {type: Schema.Types.String, required: true, unique: true},
  name: {type: Schema.Types.String, required: true},
  kind: {type: Schema.Types.String, required: true, enum: ["directory", "file"]},
  parentSlug: {type: Schema.Types.String, default: null},
  storageName: {type: Schema.Types.String},
  mimeType: {type: Schema.Types.String},
  size: {type: Schema.Types.Number},
  legacyPath: {type: Schema.Types.String, index: {sparse: true}},
}, {timestamps: true});

fileEntryScheme.index({parentSlug: 1, name: 1}, {unique: true});

export {fileEntryScheme};
export default models?.FileEntry || model<IFileEntryDocument>("FileEntry", fileEntryScheme, "files");
