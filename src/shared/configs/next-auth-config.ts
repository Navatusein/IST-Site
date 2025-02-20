import Credentials from "next-auth/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {IUser, User} from "@/entities/user";
import bcrypt from "bcryptjs"

export const nextAuthConfig: NextAuthConfig = {
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        login: {label: "login", type: "string", required: true},
        password: {label: "password", type: "password", required: true},
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials.password)
          return null;

        const user = await User.findOne<IUser>({login: credentials.login});

        if (!user)
          return null;

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.passwordHash);

        if (!passwordMatch)
          return null;

        return {...user, passwordHash: ""};
      }
    })
  ]
}