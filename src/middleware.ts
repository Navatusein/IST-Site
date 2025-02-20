import {auth} from "./auth";
import {authRoutes, publicRoutes} from "@/shared/configs/router-config";

export default auth((request) => {
  const {nextUrl} = request;

  const isAuthorized = !!request.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute)
    return;

  if (isAuthRoute) {
    if (isAuthorized)
      return Response.redirect(new URL("/controllers", nextUrl));

    return;
  }

  if (!isAuthorized && !isPublicRoute)
    return Response.redirect(new URL("/sign-in", nextUrl));

  return;
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}