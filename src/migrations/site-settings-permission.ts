import mongoose from "mongoose";

export async function grantSiteSettingsPermission(db: mongoose.mongo.Db): Promise<void> {
  await db.collection("users").updateMany(
    {permissions: "edit-users"},
    {$addToSet: {permissions: "edit-site-settings"}}
  );
}
