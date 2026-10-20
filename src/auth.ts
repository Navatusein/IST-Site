import {cache} from "react";
import {cookies} from "next/headers";
import {createHash, randomBytes} from "node:crypto";
import {ICurrentUser, IUser, UserModel, UserPermissionType} from "@/entities/user";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {ISession, SessionModel} from "@/entities/session";

export const SESSION_COOKIE_NAME = "session";

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

const SESSION_RENEW_THRESHOLD_MS = 15 * 24 * 60 * 60 * 1000;

export interface ISessionValidationResult {
  sessionId: string;
  user: ICurrentUser;
  expiresAt: Date;
  renewed: boolean;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.APP_PUBLIC_URL?.startsWith("https://") ?? false,
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt
  };
}

export async function validateSessionToken(token: string, renew: boolean = false): Promise<ISessionValidationResult | null> {
  const sessionId = hashToken(token);

  const [session] = await SessionModel.aggregate<ISession & {user?: IUser}>([
    {$match: {_id: sessionId}},
    {$limit: 1},
    {$lookup: {
      from: UserModel.collection.name,
      localField: "userId",
      foreignField: "_id",
      as: "user",
      pipeline: [{$project: {login: 1, name: 1, permissions: 1}}]
    }},
    {$set: {user: {$first: "$user"}}}
  ]);

  if (!session)
    return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await SessionModel.deleteOne({_id: sessionId});
    return null;
  }

  const user = session.user;

  if (!user) {
    await SessionModel.deleteOne({_id: sessionId});
    return null;
  }

  let expiresAt = session.expiresAt;
  let renewed = false;

  if (renew && expiresAt.getTime() - Date.now() < SESSION_RENEW_THRESHOLD_MS) {
    expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    await SessionModel.updateOne({_id: sessionId}, {$set: {expiresAt}});
    renewed = true;
  }

  return {
    sessionId,
    expiresAt,
    renewed,
    user: {
      id: String(user._id),
      login: user.login,
      name: user.name,
      permissions: user.permissions ?? []
    }
  };
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await SessionModel.create({_id: hashToken(token), userId, expiresAt});

  (await cookies()).set(SESSION_COOKIE_NAME, token, sessionCookieOptions(expiresAt));
}

export const getCurrentSession = cache(async (): Promise<ISessionValidationResult | null> => {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!token)
    return null;

  return validateSessionToken(token);
});

export const getCurrentUser = cache(async (): Promise<ICurrentUser | null> => {
  return (await getCurrentSession())?.user ?? null;
});

export async function invalidateCurrentSession(): Promise<void> {
  const session = await getCurrentSession();

  if (session)
    await SessionModel.deleteOne({_id: session.sessionId});

  (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function invalidateUserSessions(userIds: string[], exceptSessionId?: string): Promise<void> {
  await SessionModel.deleteMany({
    userId: {$in: userIds},
    ...(exceptSessionId ? {_id: {$ne: exceptSessionId}} : {})
  });
}

export async function requirePermission(permission?: UserPermissionType): Promise<ICurrentUser> {
  const user = await getCurrentUser();

  if (!user)
    throw new ServerActionError("Необхідна авторизація");

  if (permission && !user.permissions.includes(permission))
    throw new ServerActionError("Недостатньо прав");

  return user;
}
