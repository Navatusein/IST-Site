import {ReactNode} from "react";
import {AdminLayout} from "@/app/layouts/admin-layout";

interface IProps {
  children: ReactNode;
}

export default async function Layout(props: IProps) {
  return (
    <AdminLayout>
      {props.children}
    </AdminLayout>
  );
}
