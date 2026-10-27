import {Metadata} from "next";
import {AdminTrashView} from "@/views/admin-trash";

export const metadata: Metadata = {title: "Кошик"};

export default function Page() {
  return (
    <AdminTrashView/>
  );
}
