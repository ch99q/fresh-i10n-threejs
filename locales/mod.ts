import { getCookies, setCookie } from "https://deno.land/std@0.98.0/http/cookie.ts";

export const DEFAULT_LOCALE = "en-US";
export const LOCALES: Record<string, { iso: string[], extensions: string[] }> = {
  "en-US": {
    iso: ["en", "en-US"],
    extensions: ["com", "net", "org"],
  },
  "da-DK": {
    iso: ["da", "da-DK"],
    extensions: ["dk"],
  }
}

export function detectLocale(req: Request) {
  const ext = new URL(req.url).hostname.split(".").pop();
  if (ext) {
    for (const [locale, { extensions }] of Object.entries(LOCALES)) {
      if (extensions.includes(ext)) {
        return locale;
      }
    }
  }
}

export function setLocale(resp: Response, locale: string) {
  if(!isLocaleAvailable(locale)) {
    throw new Error(`Locale ${locale} is not available`);
  }
  const key = Object.keys(LOCALES).find((key) => LOCALES[key].iso.includes(locale)) || locale;
  setCookie(resp, { name: "locale", value: key, path: "/" });
}

export function isLocaleAvailable(locale: string): boolean {
  return Object.keys(LOCALES).includes(locale) ||
    Object.values(LOCALES).some(({ iso }) => iso.includes(locale));
}

export function getLocale(req: Request) {
  const cookies = getCookies(req);
  return detectLocale(req) ?? cookies.locale;
}