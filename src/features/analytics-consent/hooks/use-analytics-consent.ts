import {useSyncExternalStore} from "react";
import {getConsentState, getServerConsentState, subscribeToConsent} from "../model/consent-store";

export function useAnalyticsConsent() {
  return useSyncExternalStore(subscribeToConsent, getConsentState, getServerConsentState);
}
