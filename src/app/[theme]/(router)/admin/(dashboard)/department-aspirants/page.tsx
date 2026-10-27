import {Metadata} from "next";
import {getDepartmentAspirantsPageAction} from "@/entities/department-aspirant/actions/actions";
import {AdminDepartmentAspirantCrudView} from "@/views/admin-department-aspirant-crud";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import parsePageQuery from "@/shared/utilities/parse-page-query";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";

export const metadata: Metadata = {title: "Аспіранти кафедри"};

interface IProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page(props: IProps) {
  const query = parsePageQuery(await props.searchParams);
  const result = await unwrapServerAction(getDepartmentAspirantsPageAction(query));
  const departmentStaff = await unwrapServerAction(getDepartmentStaffAction());

  return (
    <AdminDepartmentAspirantCrudView result={result} departmentStaff={departmentStaff}/>
  );
}
