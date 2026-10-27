import type {ISiteSettingsData} from "@/entities/site-settings/types/type";
import type {INews} from "@/entities/news";
import type {IDepartmentStaff} from "@/entities/department-staff";
import {getFileAssetUrl} from "@/shared/utilities/file-urls";
import {getPublicOrigin} from "@/shared/utilities/public-url";

const absoluteUrl = (path: string | undefined): string | undefined => path ? getPublicOrigin() + path : undefined;

function organization(settings: ISiteSettingsData) {
  return {
    "@type": "EducationalOrganization",
    name: settings.organizationName || settings.siteTitle,
    url: absoluteUrl("/home"),
    logo: absoluteUrl("/icon.webp"),
    ...(settings.email && {email: settings.email}),
    ...(settings.phone && {telephone: settings.phone}),
    ...(settings.address && {address: settings.address}),
    ...(settings.socialLinks.length && {sameAs: settings.socialLinks.map((link) => link.url)})
  };
}

export function organizationStructuredData(settings: ISiteSettingsData) {
  return {"@context": "https://schema.org", ...organization(settings)};
}

export function newsStructuredData(news: INews, settings: ISiteSettingsData) {
  const image = absoluteUrl(getFileAssetUrl(news.imageSlug));
  const updatedAt = (news as INews & {updatedAt?: string}).updatedAt;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    ...(news.description && {description: news.description}),
    ...(image && {image: [image]}),
    datePublished: news.date,
    ...(updatedAt && {dateModified: updatedAt}),
    url: absoluteUrl(`/news/${news.path}`),
    publisher: organization(settings)
  };
}

export function personStructuredData(staff: IDepartmentStaff, settings: ISiteSettingsData) {
  const image = absoluteUrl(getFileAssetUrl(staff.imageSlug));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${staff.lastName} ${staff.firstName} ${staff.middleName}`.trim(),
    givenName: staff.firstName,
    familyName: staff.lastName,
    ...(staff.position && {jobTitle: staff.position}),
    ...(staff.email && {email: staff.email}),
    ...(image && {image}),
    ...(staff.profiles?.length && {sameAs: staff.profiles.map((profile) => profile.url)}),
    url: absoluteUrl(`/department-staff/${staff.path}`),
    worksFor: organization(settings)
  };
}
