export type AnalyticsConsent = "granted" | "denied";

export interface IAnalyticsConsentState {
  consent: AnalyticsConsent | null;
  isBannerOpen: boolean;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_STORAGE_KEY = "analytics-consent";

const SERVER_STATE: IAnalyticsConsentState = {consent: null, isBannerOpen: false};

const listeners = new Set<() => void>();

let state: IAnalyticsConsentState | null = null;

function readStoredConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value == "granted" || value == "denied" ? value : null;
  } catch {
    return null;
  }
}

// GA sets its cookies on the widest domain it can, so every parent domain of the host is tried
function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((cookie) => cookie.split("=")[0].trim()).filter((name) => name.startsWith("_ga"));
  const hostParts = location.hostname.split(".");
  const domains = hostParts.map((_, index) => hostParts.slice(index).join("."));

  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
}

function setState(next: IAnalyticsConsentState) {
  state = next;
  listeners.forEach((listener) => listener());
}

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getConsentState(): IAnalyticsConsentState {
  if (!state) {
    const consent = readStoredConsent();
    state = {consent, isBannerOpen: consent == null};
  }

  return state;
}

export function getServerConsentState(): IAnalyticsConsentState {
  return SERVER_STATE;
}

export function setAnalyticsConsent(consent: AnalyticsConsent) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, consent);
  } catch {
  }

  window.gtag?.("consent", "update", {analytics_storage: consent});

  if (consent == "denied")
    clearAnalyticsCookies();

  setState({consent, isBannerOpen: false});
}

export function openConsentBanner() {
  setState({...getConsentState(), isBannerOpen: true});
}
