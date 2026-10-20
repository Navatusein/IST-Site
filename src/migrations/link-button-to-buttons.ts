import mongoose from "mongoose";

export async function migrateLinkButtonToButtons(db: mongoose.mongo.Db): Promise<void> {
  for (const collectionName of ["news", "department-staff", "dynamic-pages"]) {
    const collection = db.collection(collectionName);

    for await (const document of collection.find({entities: {$exists: true}})) {
      if (!Array.isArray(document.entities))
        continue;

      let isChanged = false;

      const migrate = (entity: any): any => {
        if (entity?.type == "group" && Array.isArray(entity.components))
          return {...entity, components: entity.components.map(migrate)};

        if (entity?.componentType != "link-button")
          return entity;

        isChanged = true;

        return {
          id: entity.id,
          type: "component",
          width: entity.width ?? "small",
          componentType: "buttons",
          buttons: [{
            title: entity.title ?? "",
            linkType: entity.linkType ?? "link",
            link: entity.link ?? ""
          }],
          layout: "row",
          fullWidth: true,
          align: "start",
          variant: "primary"
        };
      };

      const entities = document.entities.map(migrate);

      if (isChanged)
        await collection.updateOne({_id: document._id}, {$set: {entities}});
    }
  }
}
