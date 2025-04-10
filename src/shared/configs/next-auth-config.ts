import Credentials from "next-auth/providers/credentials";
import {DefaultSession, NextAuthConfig} from "next-auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";
import {JWT} from "next-auth/jwt"
import {IUser, UserModel, UserPermissionType} from "@/entities/user";

declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    permissions: UserPermissionType[]
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

        const data = await response.json();

        // console.log("authorize", data)
        return data
      },

    })
  ],
  callbacks: {
    jwt({token, user}) {
      if (user) {
        token.permissions = (user as IUser).permissions
      }

      // console.log("jwt", token, user);

      return token;
    },
    session({session, token }) {
      session.user.permissions = token.permissions;

      return session;
    }
  }
}