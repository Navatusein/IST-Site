import mongoose from "mongoose";

const UK_COLLATION = {locale: "uk"};

async function setOrder(collection: mongoose.mongo.Collection, ids: mongoose.mongo.ObjectId[]): Promise<void> {
  if (ids.length == 0)
    return;

  await collection.bulkWrite(ids.map((_id, index) => ({
    updateOne: {filter: {_id}, update: {$set: {order: index}}}
  })));
}

// Keeps the order the public lists showed before it could be changed by hand
export async function migrateRecordOrder(db: mongoose.mongo.Db): Promise<void> {
  const staff = db.collection("department-staff");
  const staffIds = await staff.find({}, {projection: {_id: 1}}).sort({lastName: 1, firstName: 1}).collation(UK_COLLATION).toArray();
  await setOrder(staff, staffIds.map((x) => x._id));

  const aspirants = db.collection("department-aspirants");
  const studying = await aspirants.find({thesisDate: null}, {projection: {_id: 1}}).sort({lastName: 1, firstName: 1, middleName: 1}).collation(UK_COLLATION).toArray();
  const graduates = await aspirants.find({thesisDate: {$ne: null}}, {projection: {_id: 1}}).sort({thesisDate: -1}).toArray();
  await setOrder(aspirants, [...studying, ...graduates].map((x) => x._id));
}
