import {Mongoose, connect} from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongodbService: {connection?: Mongoose | null, promise: Promise<Mongoose> | null};
}

let cached = global.mongodbService;

if (!global.mongodbService) {
  cached = global.mongodbService = {connection: null, promise: null};
}

async function mongoDbConnect() {
  if (cached.connection)
    return cached.connection;

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    cached.promise = connect(MONGODB_URI!, {authSource: "admin"})
      .then(connection => {
        return connection;
      })
      .catch(error => {
        console.error(error)
        throw new Error("Cant connect to MongoDB", {cause: error})
      })
  }

  cached.connection = await cached.promise;
  return cached.connection;
}

export default mongoDbConnect;
