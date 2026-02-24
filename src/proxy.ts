import {auth as proxy} from "./auth";
import {permissions} from "@/shared/configs/permissions-config"
import resolveRequirementPermission from "@/shared/utilities/resolve-requirement-permission";
import {UserPermissionType} from "@/entities/user";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {getUserByIdAction} from "@/entities/user/actions/actions";

export default proxy(async (request) => {
  const {nextUrl, auth} = request;

  if (auth == null)
    return Response.redirect(new URL("/not-found", nextUrl));

  const requiredPermission = resolveRequirementPermission(permissions, nextUrl.pathname);

  const user = await useServerAction(getUserByIdAction(auth.user.id));

  if (!user)
    return Response.redirect(new URL("/requiredPermission", nextUrl));

  const userPermissions = user.permissions

  if (requiredPermission && !userPermissions.includes(requiredPermission as UserPermissionType))
    return Response.redirect(new URL("/requiredPermission", nextUrl));

  return;
})

export const config = {
  matcher: [
    "/admin/:path*"
  ],
}