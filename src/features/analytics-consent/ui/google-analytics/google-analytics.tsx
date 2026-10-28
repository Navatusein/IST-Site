import Script from "next/script";
import {CONSENT_STORAGE_KEY} from "../../model/consent-store";

interface IProps {
  measurementId: string;
}

export default function GoogleAnalytics(props: IProps) {
  return (
    <>
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var consent = null;
try { consent = localStorage.getItem("${CONSENT_STORAGE_KEY}"); } catch (e) {}
gtag("consent", "default", {
  analytics_storage: consent === "granted" ? "granted" : "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
gtag("js", new Date());
gtag("config", "${props.measurementId}");`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${props.measurementId}`} strategy="afterInteractive"/>
    </>
  )
}
