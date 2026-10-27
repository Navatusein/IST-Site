import {ReactNode} from "react";
import {Metadata} from "next";
import {getCurrentUser} from "@/auth";
import SessionProvider from "@/app/provider/session-provider/session-provider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {default: "Адмінпанель", template: "%s — Адмінпанель"},
  robots: {index: false, follow: false}
};

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
