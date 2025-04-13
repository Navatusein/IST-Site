import {ReactNode} from "react";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <>
      {props.children}
    </>
  );
}
