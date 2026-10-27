import {Metadata} from "next";
import {notFound} from "next/navigation";
import {isTestPageEnabled} from "@/shared/configs/test-page";
import TestSandbox from "./test-sandbox";

export const metadata: Metadata = {robots: {index: false, follow: false}};

export const dynamic = "force-dynamic";

export default function Page() {
  if (!isTestPageEnabled())
    notFound();

  return <TestSandbox/>;
}
