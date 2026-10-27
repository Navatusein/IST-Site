import {NextRequest, NextResponse} from "next/server";
import {SESSION_COOKIE_NAME, sessionCookieOptions, validateSessionToken} from "./auth";
import {permissions} from "@/shared/configs/permissions-config"
import resolveRequirementPermission from "@/shared/utilities/resolve-requirement-permission";
import {UserPermissionType} from "@/entities/user";
import {resolveSiteTheme, THEME_COOKIE_NAME} from "@/shared/configs/site-theme";
import {isTestPageEnabled, TEST_PAGE_PATH} from "@/shared/configs/test-page";
import {isIndexingAllowed, NO_INDEX_HEADER, ROBOTS_HEADER} from "@/shared/configs/indexing";

function rewriteToTheme(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const theme = resolveSiteTheme(request.cookies.get(THEME_COOKIE_NAME)?.value);
  const isHiddenTestPage = (url.pathname == TEST_PAGE_PATH || url.pathname.startsWith(TEST_PAGE_PATH + "/")) && !isTestPageEnabled();

  url.pathname = isHiddenTestPage ? `/${theme}/not-found` : `/${theme}${url.pathname}`;

  const response = NextResponse.rewrite(url, isHiddenTestPage ? {status: 404} : undefined);

  response.headers.set("Cache-Control", "private, no-cache");

  if (!isIndexingAllowed())
    response.headers.set(ROBOTS_HEADER, NO_INDEX_HEADER);

  return response;
}

async function guardAdmin(request: NextRequest): Promise<NextResponse> {
  const {nextUrl} = request;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await validateSessionToken(token, true) : null;

  if (!session) {
    const response = NextResponse.redirect(new URL("/not-found", nextUrl));

    if (token)
      response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  }

  const requiredPermission = resolveRequirementPermission(permissions, nextUrl.pathname);

  if (requiredPermission && !session.user.permissions.includes(requiredPermission as UserPermissionType))
    return NextResponse.redirect(new URL("/admin/forbidden", nextUrl));

  const response = rewriteToTheme(request);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set(ROBOTS_HEADER, NO_INDEX_HEADER);

  if (session.renewed)
    response.cookies.set(SESSION_COOKIE_NAME, token!, sessionCookieOptions(session.expiresAt));

  return response;
}

export default async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Served statically from public/files
  if (pathname.startsWith("/files/")) {
    const response = NextResponse.next();

    if (!isIndexingAllowed())
      response.headers.set(ROBOTS_HEADER, NO_INDEX_HEADER);

    return response;
  }

  if (pathname == "/admin" || pathname.startsWith("/admin/"))
    return guardAdmin(request);

  return rewriteToTheme(request);
}

export const config = {
  matcher: [
    "/((?!api/|_next/|icon\\.webp|missing-image\\.webp|red-corps\\.webp|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)"
  ],
}
