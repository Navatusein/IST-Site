import {isValidObjectId, Model} from "mongoose";
import toPlainObject from "./to-plain-object";

export async function findRecordById<T>(model: Model<any>, id: unknown): Promise<T | null> {
  if (!isValidObjectId(id))
    return null;

  const data = await model.findById(id);

  return data ? toPlainObject<T>(data) : null;
}
