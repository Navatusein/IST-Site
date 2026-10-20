import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
import {notFound} from "next/navigation";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getDepartmentStaffByPathAction} from "@/entities/department-staff/actions/actions";
import {DepartmentStaffView} from "@/views/department-staff";
import {loadPageComponentsData} from "@/app/page-components/load-page-components-data";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";

export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

interface IProps {
  params: Promise<{
    path: string;
  }>
}

export async function generateMetadata(props: IProps): Promise<Metadata> {
  const {path} = await props.params;
  const staff = await unwrapServerAction(getDepartmentStaffByPathAction(path));

  if (!staff)
    return {};

  const name = `${staff.lastName} ${staff.firstName} ${staff.middleName}`;
  const image = getFileAssetUrl(staff.imageSlug);

  return {
    title: await pageTitle(name),
    ...(staff.position && {description: staff.position}),
    openGraph: {type: "profile", title: name, description: staff.position, images: image ? [image] : undefined}
  };
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const departmentStaff = await unwrapServerAction(getDepartmentStaffByPathAction(path));

  if (!departmentStaff)
    notFound();

  const componentsData = await loadPageComponentsData(departmentStaff.entities);

  return (
    <DepartmentStaffView departmentStaff={departmentStaff} componentsData={componentsData}/>
  )
}