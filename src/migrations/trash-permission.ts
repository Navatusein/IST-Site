import mongoose from "mongoose";

export async function grantTrashPermission(db: mongoose.mongo.Db): Promise<void> {
  await db.collection("users").updateMany(
    {permissions: "edit-users"},
    {$addToSet: {permissions: "manage-trash"}}
  );
}
