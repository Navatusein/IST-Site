import {Metadata} from "next";
import {AdminFileManagerView} from "@/views/admin-file-manager";

export const metadata: Metadata = {title: "Файловий менеджер"};

export default async function Page() {
  return (
    <AdminFileManagerView/>
  );
}