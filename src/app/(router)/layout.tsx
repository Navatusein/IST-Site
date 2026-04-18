import {ReactNode} from "react";

interface IProps {
  children: ReactNode;
  modals: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <>
      {props.children}
      {props.modals}
    </>
  );
}
