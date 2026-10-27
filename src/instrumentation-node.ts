import mongoDbConnect from "@/shared/services/mongodb-service/mongodb-service";
import {IUser, UserModel} from "@/entities/user";
import {defaultPermissions} from "@/shared/configs/permissions-config";
import {runMigrations} from "@/migrations";

export async function registerNode() {
  const connection = await mongoDbConnect();

  console.log("MongoDB version: ", connection.version);

  const usersCount = await UserModel.countDocuments();

  if (usersCount == 0) {
    const newUser = new UserModel({
      login: process.env.ADMIN_LOGIN,
      name: "Admin",
      permissions: [...defaultPermissions]
    } as IUser);

    console.log("No users found");
    console.log("Creating init admin user");

    await newUser.setPassword(process.env.ADMIN_PASSWORD);
    await newUser.save();
  }

  await runMigrations();
}
