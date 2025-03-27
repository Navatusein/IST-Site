"use client"

import {ReactNode} from "react";
import {SessionProvider as NextAuthSessionProvider} from "next-auth/react";

interface IProps {
  children: ReactNode;
}

export default function SessionProvider(props: IProps) {
  return (
    <NextAuthSessionProvider>
      {props.children}
    </NextAuthSessionProvider>
  );
};