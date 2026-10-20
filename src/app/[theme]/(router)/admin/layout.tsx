import {ReactNode} from "react";
import {getCurrentUser} from "@/auth";
import SessionProvider from "@/app/provider/session-provider/session-provider";

export const dynamic = "force-dynamic";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  const user = await getCurrentUser();

  return (
    <SessionProvider user={user}>
      {props.children}
    </SessionProvider>
  );
}
