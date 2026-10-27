import {Metadata} from "next";
import {AdminHomeView} from "@/views/admin-home";

export const metadata: Metadata = {title: "Головна"};

export default function Page() {
  return (
    <AdminHomeView/>
  );
}
