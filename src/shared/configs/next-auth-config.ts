import Credentials from "next-auth/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";
import {JWT} from "next-auth/jwt"
import {IUser} from "@/entities/user";

declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const nextAuthConfig: NextAuthConfig = {
  debug: false,
  session: {
    strategy: "jwt"
  },
  logger: {
    error(error: Error) {
      if ((error as any).type === "CredentialsSignin") {
        return;
      }

      console.error(error);
    },
    warn(message: string) {
      console.warn(message);
    },
    debug(message: string) {
      console.debug(message);
    },
  },
  providers: [
    Credentials({
      credentials: {
        login: {label: "login", type: "string", required: true},
        password: {label: "password", type: "password", required: true},
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials.password)
          throw new CouldNotParseError();

        //TODO get path from configs
        const response = await fetch("http://localhost:3000/api/login", {method: "POST", body: JSON.stringify(credentials)});

        if (response.status !== 200)
          throw new InvalidPasswordError();

        return await response.json();
      },

    })
  ],
  callbacks: {
    jwt({token, user}) {
      if (user)
        token.id = (user as IUser)._id as string

      return token;
    },
    async session({session, token }) {
      session.user.id = token.id

      console.log("session", session.user)

      return session;
    }
  }
}