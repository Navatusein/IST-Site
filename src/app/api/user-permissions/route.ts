import {getUserByIdAction} from "@/entities/user/actions/actions";

export async function POST(request: Request) {
  try {
    const {id} = await request.json();

    const user = await getUserByIdAction(id);

    if (!user)
      return new Response("No such user", {status: 404});

    return new Response(JSON.stringify(user.permissions) , {status: 200});
  }
  catch (error) {
    return new Response(`Error: ${(error as Error).message}`, {status: 500});
  }
}