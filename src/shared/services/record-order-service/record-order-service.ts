import {isValidObjectId, Model} from "mongoose";
import {ServerActionError} from "@/shared/exceptions/server-action-error";

export async function getNextOrder(recordModel: Model<any>): Promise<number> {
  const last = await recordModel.findOne({order: {$type: "number"}}, {order: 1}).sort({order: -1}).lean<{order: number}>();
  return last ? last.order + 1 : 0;
}

export async function saveOrder(recordModel: Model<any>, ids: unknown): Promise<void> {
  if (!Array.isArray(ids) || !ids.every((id) => typeof id == "string" && isValidObjectId(id)) || new Set(ids).size != ids.length)
    throw new ServerActionError("Невірний порядок записів");

  await recordModel.bulkWrite(ids.map((id, index) => ({
    updateOne: {filter: {_id: id}, update: {$set: {order: index}}, timestamps: false}
  })));
}
