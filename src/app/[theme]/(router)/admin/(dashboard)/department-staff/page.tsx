import {Metadata} from "next";
import {getDepartmentStaffPageAction} from "@/entities/department-staff/actions/actions";
import {AdminDepartmentStaffCrudView} from "@/views/admin-department-staff-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";

export const metadata: Metadata = {title: "Співробітники кафедри"};

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const result = await unwrapServerAction(getDepartmentStaffPageAction(query));

  return (
    <AdminDepartmentStaffCrudView result={result}/>
  );
}
