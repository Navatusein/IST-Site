import normalizeUrl from "normalize-url";
import mongoDbConnect from "@/shared/services/mongodb-service/mongodb-service";
import {IUser, UserModel} from "@/entities/user";

export async function register() {
  const connection = await mongoDbConnect();

  console.log("MongoDB version: ", connection.version);

  const usersCount = await UserModel.countDocuments();

  if (usersCount == 0) {
    const newUser = new UserModel({
      login: process.env.ADMIN_LOGIN,
      name: "Admin",
      permissions: ["edit-news", "edit-users", "edit-pages", "edit-files"]
    } as IUser);

    console.log("No users found");
    console.log("Creating init admin user");

    await newUser.setPassword(process.env.ADMIN_PASSWORD);
    await newUser.save();
  }
}
