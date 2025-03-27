import {IUser, UserModel} from "@/entities/user";
import bcrypt from "bcryptjs";
import {json} from "node:stream/consumers";

export async function POST(request: Request) {
  try {
    const {login, password} = await request.json();

    const user = await UserModel.findOne<IUser>({login: login as string}).lean();

    if (!user)
      return new Response(`Invalid login or password`, {status: 401});

    const passwordMatch = await bcrypt.compare(password as string, user.passwordHash);

    if (!passwordMatch)
      return new Response(`Invalid login or password`, {status: 401});

    return new Response(JSON.stringify({...user, passwordHash: ""}) , {status: 200});
  }
  catch (error) {
    return new Response(`Error: ${(error as Error).message}`, {status: 500});
  }
}