import Credentials from "next-auth/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";
import {IUser} from "@/entities/user";
import normalizeUrl from "normalize-url";

//@ts-ignore
import {JWT} from "next-auth/jwt"

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
  secret: process.env.SECRET,
  redirectProxyUrl: normalizeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`),
  trustHost: true,
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

        const response = await fetch(
          normalizeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`),
          {method: "POST", body: JSON.stringify(credentials)}
        );

        if (response.status !== 200)
          throw new InvalidPasswordError();

        return await response.json();
      },
    })
  ],
  callbacks: {
    jwt({token, user}) {
      if (user)
        token.id = (user as IUser)._id as unknown as string

      return token;
    },
    async session({session, token }) {
      session.user.id = token.id

      return session;
    }
  }
}