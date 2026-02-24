import {auth} from "./auth";
import {permissions} from "@/shared/configs/permissions-config"
import resolveRequirementPermission from "@/shared/utilities/resolve-requirement-permission";
import {UserPermissionType} from "@/entities/user";
import normalizeUrl from "normalize-url";

export default auth(async (request) => {
  const {nextUrl, auth} = request;

  if (auth == null)
    return Response.redirect(new URL("/not-found", nextUrl));

  const requiredPermission = resolveRequirementPermission(permissions, nextUrl.pathname);
  const response = await fetch(
    normalizeUrl(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-permissions`),
    {method: "POST", body: JSON.stringify({id: auth.user.id})}
  );

  if (response.status !== 200)
    return Response.redirect(new URL("/requiredPermission", nextUrl));

  const userPermissions = await response.json();

  if (requiredPermission && !userPermissions.includes(requiredPermission as UserPermissionType))
    return Response.redirect(new URL("/requiredPermission", nextUrl));

  return;
})

export const config = {
  matcher: [
    "/admin/:path*"
  ],
}