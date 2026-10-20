import {redirect} from "next/navigation";
import {SignInView} from "@/views/sign-in";
import {getCurrentUser} from "@/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
  if (await getCurrentUser())
    redirect("/admin");

  return (
    <SignInView/>
  );
}
