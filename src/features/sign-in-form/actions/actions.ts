"use server"

import bcrypt from "bcryptjs";
import {createSession} from "@/auth";
import {IUser, UserModel} from "@/entities/user";
import {createServerAction} from "@/shared/utilities/create-server-action";
import {RateLimiter} from "@/shared/utilities/rate-limiter";
import {getClientIp} from "@/shared/utilities/get-client-ip";

export type SignInResult = "Success" | "InvalidCredentials" | "TooManyAttempts";

const MAX_LOGIN_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 256;
const MAX_TRUSTED_ADDRESSES = 10000;
const TRUSTED_ADDRESS_TTL = 30 * 24 * 60 * 60 * 1000;

const signInRateLimiter = new RateLimiter(5, 15 * 60 * 1000);
const loginRateLimiter = new RateLimiter(20, 15 * 60 * 1000);
const trustedAddresses = new Map<string, number>();

const DUMMY_PASSWORD_HASH = "$2b$10$j0hgaxn6R4Z77HTahOlFN.e5ddjo7rr80mfZR4elrUBc2UaI/z3Xq";

function isTrustedAddress(key: string): boolean {
  const expiresAt = trustedAddresses.get(key);

  if (expiresAt == undefined)
    return false;

  if (expiresAt > Date.now())
    return true;

  trustedAddresses.delete(key);
  return false;
}

function trustAddress(key: string): void {
  trustedAddresses.delete(key);
  trustedAddresses.set(key, Date.now() + TRUSTED_ADDRESS_TTL);

  for (const oldestKey of trustedAddresses.keys()) {
    if (trustedAddresses.size <= MAX_TRUSTED_ADDRESSES)
      break;

    trustedAddresses.delete(oldestKey);
  }
}

export const actionSignIn = createServerAction<SignInResult>(async (login: unknown, password: unknown) => {
  if (typeof login !== "string" || typeof password !== "string" || !login || !password)
    return "InvalidCredentials";

  if (login.length > MAX_LOGIN_LENGTH || password.length > MAX_PASSWORD_LENGTH)
    return "InvalidCredentials";

  const loginKey = login.toLowerCase();
  const rateLimitKey = `${loginKey}|${await getClientIp()}`;
  const trusted = isTrustedAddress(rateLimitKey);

  if (signInRateLimiter.isLimited(rateLimitKey) || (!trusted && loginRateLimiter.isLimited(loginKey)))
    return "TooManyAttempts";

  const user = await UserModel.findOne({login}).lean<IUser>();
  const passwordMatch = await bcrypt.compare(password, user?.passwordHash || DUMMY_PASSWORD_HASH);

  if (!user || !user.passwordHash || !passwordMatch) {
    signInRateLimiter.registerFailure(rateLimitKey);

    if (!trusted)
      loginRateLimiter.registerFailure(loginKey);

    return "InvalidCredentials";
  }

  signInRateLimiter.reset(rateLimitKey);
  trustAddress(rateLimitKey);
  await createSession(String(user._id));

  return "Success";
});
