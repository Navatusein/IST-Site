import {auth} from "./auth";
import {permissions} from "@/shared/configs/permissions-config"
import resolveRequirementPermission from "@/shared/utilities/resolve-requirement-permission";
import {UserPermissionType} from "@/entities/user";

export default auth((request) => {
  const {nextUrl, auth} = request;

  if (auth == null)
    return Response.redirect(new URL("/sign-in", nextUrl));

  const requiredPermission = resolveRequirementPermission(permissions, nextUrl.pathname);
  const userPermissions = auth.user.permissions;

  if (requiredPermission && !userPermissions.includes(requiredPermission as UserPermissionType))
    return Response.redirect(new URL("/requiredPermission", nextUrl));

  return;
})


export const config = {
  matcher: [
    "/admin/:path*"
  ],
}