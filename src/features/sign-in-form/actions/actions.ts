"use server"

import bcrypt from "bcryptjs";
import {createSession} from "@/auth";
import {IUser, UserModel} from "@/entities/user";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {RateLimiter} from "@/shared/utilities/rate-limiter";
import {getClientIp} from "@/shared/utilities/get-client-ip";

export type SignInResult = "Success" | "InvalidCredentials" | "TooManyAttempts";

const signInRateLimiter = new RateLimiter(5, 15 * 60 * 1000);
const loginRateLimiter = new RateLimiter(20, 15 * 60 * 1000);

const DUMMY_PASSWORD_HASH = "$2b$10$j0hgaxn6R4Z77HTahOlFN.e5ddjo7rr80mfZR4elrUBc2UaI/z3Xq";

export const actionSignIn = createServerAction<SignInResult>(async (login: string, password: string) => {
  if (typeof login !== "string" || typeof password !== "string" || !login || !password)
    return "InvalidCredentials";

  const loginKey = login.toLowerCase();
  const rateLimitKey = `${loginKey}|${await getClientIp()}`;

  if (signInRateLimiter.isLimited(rateLimitKey) || loginRateLimiter.isLimited(loginKey))
    return "TooManyAttempts";

  const user = await UserModel.findOne({login}).lean<IUser>();
  const passwordMatch = await bcrypt.compare(password, user?.passwordHash || DUMMY_PASSWORD_HASH);

  if (!user || !user.passwordHash || !passwordMatch) {
    signInRateLimiter.registerFailure(rateLimitKey);
    loginRateLimiter.registerFailure(loginKey);
    return "InvalidCredentials";
  }

  signInRateLimiter.reset(rateLimitKey);
  await createSession(String(user._id));

  return "Success";
});
