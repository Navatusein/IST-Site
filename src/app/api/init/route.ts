import mongoDbConnect from "@/shared/services/mongodb-service/mongodb-service";
import {IUser, UserModel} from "@/entities/user";

export async function GET() {
  try {
    const connection = await mongoDbConnect();
    const usersCount = await UserModel.countDocuments();

    if (usersCount == 0) {
      const newUser = new UserModel({login: "admin", name: "admin", permissions: ["edit-news", "edit-users", "edit-pages", "edit-files"]} as IUser);

      console.log("Added base user")

      await newUser.setPassword("password");
      await newUser.save();
    }

    return new Response(JSON.stringify({
      mongoDbVersion: connection.version
    }), {status: 200});
  }
  catch (error) {
    return new Response(JSON.stringify({
      message: `Error: ${(error as Error).message}`
    }), {status: 500});
  }
}