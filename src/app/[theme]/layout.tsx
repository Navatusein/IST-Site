import {ReactNode} from "react";
import {notFound} from "next/navigation";
import {BaseLayout} from "@/app/layouts/base-layout";
import {SITE_THEMES, SiteTheme} from "@/shared/configs/site-theme";

interface IProps {
  children: ReactNode;
  params: Promise<{theme: string}>;
}

export function generateStaticParams() {
  return [];
}

export default async function Layout(props: IProps) {
  const {theme} = await props.params;

  if (!SITE_THEMES.includes(theme as SiteTheme))
    notFound();

  return (
    <BaseLayout theme={theme as SiteTheme}>
      {props.children}
    </BaseLayout>
  );
}
