import {MetadataRoute} from "next";
import {isIndexingAllowed} from "@/shared/configs/indexing";
import {getPublicOrigin} from "@/shared/utilities/public-url";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed())
    return {rules: {userAgent: "*", disallow: "/"}};

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/assets/"],
      disallow: ["/admin", "/api/", "/sign-in", "/test"]
    },
    sitemap: `${getPublicOrigin()}/sitemap.xml`
  };
}
