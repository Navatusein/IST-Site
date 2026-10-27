import {Metadata} from "next";
import {AdminForbiddenView} from "@/views/admin-forbidden";

export const metadata: Metadata = {title: "Доступ заборонено"};

export default function Page() {
  return (
    <AdminForbiddenView/>
  );
}
