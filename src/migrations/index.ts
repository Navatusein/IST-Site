import mongoose from "mongoose";
import {migrateFilesToSlugs} from "./files-to-slugs";
import {migrateLinkButtonToButtons} from "./link-button-to-buttons";
import {migrateMenuParentObjectIds} from "./menu-parent-object-ids";
import {grantSiteSettingsPermission} from "./site-settings-permission";
import {migrateRowsToLayout} from "./rows-to-layout";
import {migrateCardsToLayout} from "./cards-to-layout";
import {grantTrashPermission} from "./trash-permission";

interface IMigration {
  id: string;
  run: (db: mongoose.mongo.Db) => Promise<void>;
}

const migrations: IMigration[] = [
  {id: "2026-10-files-to-slugs", run: migrateFilesToSlugs},
  {id: "2026-10-link-button-to-buttons", run: migrateLinkButtonToButtons},
  {id: "2026-10-menu-parent-object-ids", run: migrateMenuParentObjectIds},
  {id: "2026-10-site-settings-permission", run: grantSiteSettingsPermission},
  {id: "2026-10-rows-to-layout", run: migrateRowsToLayout},
  {id: "2026-10-cards-to-layout", run: migrateCardsToLayout},
  {id: "2026-10-trash-permission", run: grantTrashPermission},
];

export async function runMigrations(): Promise<void> {
  const db = mongoose.connection.db!;
  const applied = db.collection<{_id: string, appliedAt: Date}>("migrations");

  for (const migration of migrations) {
    if (await applied.findOne({_id: migration.id}))
      continue;

    console.log(`Applying migration ${migration.id}`);

    await migration.run(db);
    await applied.insertOne({_id: migration.id, appliedAt: new Date()});

    console.log(`Migration ${migration.id} applied`);
  }
}
