import {Schema} from "mongoose";
import {IBasePageComponent} from "@/entities/base-page-component";

const basePageComponentSchema = new Schema<IBasePageComponent>({
    type: { type: String, required: true },
}, {discriminatorKey: "type", _id: false});

export {basePageComponentSchema};