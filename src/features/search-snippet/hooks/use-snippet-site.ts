"use client"

import {useEffect, useState} from "react";
import {getSiteSettingsAction} from "@/entities/site-settings/actions/actions";
import {getBaseUrl} from "@/shared/actions/get-base-url";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

export interface ISnippetSite {
  shortName: string;
  origin: string;
}

export function useSnippetSite(): ISnippetSite | null {
  const [site, setSite] = useState<ISnippetSite | null>(null);

  useEffect(() => {
    Promise.all([unwrapServerAction(getSiteSettingsAction()), unwrapServerAction(getBaseUrl())])
      .then(([settings, baseUrl]) => setSite({shortName: settings.siteShortName, origin: (baseUrl ?? "").replace(/\/+$/, "")}))
      .catch(() => setSite({shortName: "", origin: ""}));
  }, []);

  return site;
}
