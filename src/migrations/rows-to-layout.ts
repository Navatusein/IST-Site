import mongoose from "mongoose";

const EQUAL_SPANS: Record<number, string> = {1: "1", 2: "1/2", 3: "1/3", 4: "1/4"};

function migrateRow(row: any): any {
  const components: any[] = Array.isArray(row.components) ? row.components : [];

  const spans = components.length == 2 && row.proportions == "1:2" ? ["1/3", "2/3"] :
    components.length == 2 && row.proportions == "2:1" ? ["2/3", "1/3"] :
      components.map(() => EQUAL_SPANS[components.length] ?? "1/4");

  const {proportions: _, ...rest} = row;

  return {
    ...rest,
    cards: false,
    components: components.map((component, index) => ({...component, columnSpan: component.columnSpan ?? spans[index]}))
  };
}

export async function migrateRowsToLayout(db: mongoose.mongo.Db): Promise<void> {
  for (const collectionName of ["news", "department-staff", "dynamic-pages"]) {
    const collection = db.collection(collectionName);

    for await (const document of collection.find({"entities.type": "group"})) {
      if (!Array.isArray(document.entities))
        continue;

      const entities = document.entities.map((entity: any) => entity?.type == "group" ? migrateRow(entity) : entity);

      await collection.updateOne({_id: document._id}, {$set: {entities}});
    }
  }
}
