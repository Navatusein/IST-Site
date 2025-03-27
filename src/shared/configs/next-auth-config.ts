import Credentials from "next-auth/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {CouldNotParseError, InvalidPasswordError} from "@/shared/types/next-auth-exceptions";

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

        const response = await fetch("http://localhost:3000/api/login", {method: "POST", body: JSON.stringify(credentials)});

        if (response.status !== 200)
          throw new InvalidPasswordError();

        return await response.json()
      }
    })
  ]
}