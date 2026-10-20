import mongoose from "mongoose";

export async function migrateMenuParentObjectIds(db: mongoose.mongo.Db): Promise<void> {
  const collection = db.collection("public-menu-items");

  for await (const item of collection.find({parent: {$type: "string"}})) {
    const parent = item.parent as string;
    const isObjectId = /^[0-9a-f]{24}$/i.test(parent);

    await collection.updateOne(
      {_id: item._id},
      {$set: {parent: isObjectId ? new mongoose.Types.ObjectId(parent) : null}}
    );
  }
}
