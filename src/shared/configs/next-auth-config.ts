import Credentials from "next-auth/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";
import {IUser, UserModel} from "@/entities/user";
import normalizeUrl from "normalize-url";

//@ts-ignore
import {JWT} from "next-auth/jwt"
import bcrypt from "bcryptjs";
import {json} from "node:stream/consumers";
import toPlainObject from "@/shared/utilities/to-plain-object";

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
  secret: process.env.APP_SECRET,
  redirectProxyUrl: normalizeUrl(`${process.env.APP_PUBLIC_URL}/api/auth`),
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

        const user = await UserModel.findOne<IUser>({login: credentials.login}).lean();

        if (!user || !user.passwordHash)
          throw new InvalidPasswordError();

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!passwordMatch)
          throw new InvalidPasswordError();

        console.log("asdfs", toPlainObject<IUser>({...user, passwordHash: ""} as unknown as IUser))

        return toPlainObject<IUser>({...user, passwordHash: ""} as unknown as IUser);
      },
    })
  ],
  callbacks: {
    jwt({token, user}) {
      if (user)
        token.id = (user as IUser)._id as unknown as string;

      return token;
    },
    async session({session, token }) {
      session.user.id = token.id

      return session;
    }
  }
}