import mongoDbConnect from "@/shared/services/mongodb-service/mongodb-service";
import {User} from "@/entities/user";

export async function GET(request: Request) {
  try {
    const connection = await mongoDbConnect();

    const usersCount = await User.countDocuments();

    if (usersCount == 0) {
      const newUser = new User({login: "admin", name: "admin"});

      console.log("Added base user")

      await newUser.setPassword("password");
      await newUser.save();
    }

    return new Response(`Version: ${connection.version} Count: ${usersCount}`, {status: 200});
  }
  catch (error) {
    return new Response(`Error: ${(error as Error).message}`, {status: 500});
  }
}