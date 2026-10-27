import {Metadata} from "next";
import {AdminChangesView} from "@/views/admin-changes";

export const metadata: Metadata = {title: "Журнал змін"};

export default function Page() {
  return (
    <AdminChangesView/>
  );
}
