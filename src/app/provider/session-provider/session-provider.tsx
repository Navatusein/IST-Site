"use client"

import {ReactNode, useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {ICurrentUser} from "@/entities/user";
import {CurrentUserContext} from "@/entities/user/context/current-user-context";
import {getCurrentUserAction} from "@/entities/user/actions/actions";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

interface IProps {
  user?: ICurrentUser | null;
  children: ReactNode;
}

export default function SessionProvider(props: IProps) {
  const isServerProvided = props.user !== undefined;
  const [loadedUser, setLoadedUser] = useState<ICurrentUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isServerProvided)
      return;

    let isCancelled = false;

    unwrapServerAction(getCurrentUserAction())
      .then((user) => !isCancelled && setLoadedUser(() => user))
      .catch(() => !isCancelled && setLoadedUser(() => null));

    return () => {
      isCancelled = true;
    };
  }, [isServerProvided, pathname]);

  return (
    <CurrentUserContext value={isServerProvided ? props.user! : loadedUser}>
      {props.children}
    </CurrentUserContext>
  );
};
