import {auth} from "./auth";
import {permissions} from "@/shared/configs/permissions-config"
import resolveRequirementPermission from "@/shared/utilities/resolve-requirement-permission";
import {UserPermissionType} from "@/entities/user";

export default auth(async (request) => {
  const {nextUrl, auth} = request;

  if (auth == null)
    return Response.redirect(new URL("/sign-in", nextUrl));

  const requiredPermission = resolveRequirementPermission(permissions, nextUrl.pathname);
  //TODO get path from configs
  const response = await fetch("http://localhost:3000/api/user-permissions", {method: "POST", body: JSON.stringify({id: auth.user.id})});

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