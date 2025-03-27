import "@/shared/styles/global.scss";
import "@ant-design/v5-patch-for-react-19";
import {ReactNode} from "react";
import {BaseLayout} from "@/app/layouts/base-layout";
import ThemeProvider from "@/app/provider/theme-provider/theme-provider";
import {Metadata} from "next";

interface IProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Кафедра інформаційних систем та технологій КНУ імені Тараса Шевченка",
  description: "Інформація про кафедру інформаційних систем та технологій КНУ імені Тараса Шевченка, її співробітників та аспірантів, освітні програми підготовки бакалаврів, магістрів та докторів філософії зі спеціальності 126 - &quot;Інформаційні системи та технології&quot;",
};

export default function Layout(props: IProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body>
    <link rel="shortcut icon" href={"icon.png"}/>
    <BaseLayout>
      {props.children}
    </BaseLayout>
    </body>
    </html>
  );
}
