import {getNewsFeedAction} from "@/features/sitemap";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {SITE_SETTINGS_DEFAULTS} from "@/entities/site-settings/types/type";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {getPublicOrigin} from "@/shared/utilities/public-url";
import {getFileImageUrl} from "@/shared/utilities/file-urls";

export const dynamic = "force-dynamic";

const escapeXml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

export async function GET() {
  const origin = getPublicOrigin();
  const [news, settings] = await Promise.all([
    unwrapServerAction(getNewsFeedAction()),
    unwrapServerAction(getSiteSettingsAction()).catch(() => SITE_SETTINGS_DEFAULTS)
  ]);

  const items = news.map((item) => {
    const url = origin + item.path;
    const image = item.imageSlug && origin + getFileImageUrl(item.imageSlug, 1280);

    return [
      "    <item>",
      `      <title>${escapeXml(item.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(item.date).toUTCString()}</pubDate>`,
      ...(item.description ? [`      <description>${escapeXml(item.description)}</description>`] : []),
      ...(image ? [`      <enclosure url="${escapeXml(image)}" type="image/webp" length="0"/>`] : []),
      "    </item>"
    ].join("\n");
  });

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    "  <channel>",
    `    <title>${escapeXml(`Новини — ${settings.siteShortName}`)}</title>`,
    `    <link>${escapeXml(origin + "/news")}</link>`,
    `    <description>${escapeXml(settings.siteDescription || settings.siteTitle)}</description>`,
    "    <language>uk</language>",
    `    <atom:link href="${escapeXml(origin + "/rss.xml")}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "  </channel>",
    "</rss>"
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900"
    }
  });
}
