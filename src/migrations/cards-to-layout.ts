import mongoose from "mongoose";
import {randomUUID} from "crypto";

function migrateCards(entity: any): any {
  const cards: any[] = Array.isArray(entity.cards) ? entity.cards : [];
  const cardsInRow = entity.cardsInRow == 3 ? 3 : 2;
  const span = cardsInRow == 3 ? "1/3" : "1/2";
  const isFirstWide = cards.length % cardsInRow == 1;

  return {
    id: entity.id,
    type: "group",
    width: entity.width ?? "medium",
    verticalAlign: "top",
    cards: true,
    components: cards.map((card, index) => ({
      id: randomUUID(),
      type: "component",
      width: "small",
      componentType: "rich-text",
      columnSpan: index == 0 && isFirstWide ? "1" : span,
      text: card?.content ?? ""
    }))
  };
}

export async function migrateCardsToLayout(db: mongoose.mongo.Db): Promise<void> {
  for (const collectionName of ["news", "department-staff", "dynamic-pages"]) {
    const collection = db.collection(collectionName);

    for await (const document of collection.find({"entities.componentType": "cards"})) {
      if (!Array.isArray(document.entities))
        continue;

      const entities = document.entities.map((entity: any) => entity?.componentType == "cards" ? migrateCards(entity) : entity);

      await collection.updateOne({_id: document._id}, {$set: {entities}});
    }
  }
}
