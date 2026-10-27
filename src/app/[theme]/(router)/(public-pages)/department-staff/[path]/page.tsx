import {Metadata} from "next";
import {pageTitle} from "@/app/page-components/page-title";
import {openGraph} from "@/app/page-components/open-graph";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {JsonLd} from "@/shared/ui-kit";
import {personStructuredData} from "@/app/page-components/structured-data";
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
    alternates: {canonical: `/department-staff/${staff.path}`},
    title: await pageTitle(name),
    ...(staff.position && {description: staff.position}),
    openGraph: await openGraph({
      type: "profile",
      title: name,
      url: `/department-staff/${staff.path}`,
      firstName: staff.firstName,
      lastName: staff.lastName,
      ...(staff.position && {description: staff.position}),
      ...(image && {images: [image]})
    })
  };
}

export default async function Page(props: IProps) {
  const {path} = await props.params;

  const departmentStaff = await unwrapServerAction(getDepartmentStaffByPathAction(path));

  if (!departmentStaff)
    notFound();

  const [componentsData, settings] = await Promise.all([
    loadPageComponentsData(departmentStaff.entities),
    unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS)
  ]);

  return (
    <>
      <JsonLd data={personStructuredData(departmentStaff, settings)}/>
      <DepartmentStaffView departmentStaff={departmentStaff} componentsData={componentsData}/>
    </>
  )
}