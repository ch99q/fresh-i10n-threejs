import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { DEFAULT_LOCALE, detectLocale, getLocale, setLocale } from "../locales/mod.ts";

interface State {
  locale: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  let update = false;
  let locale = getLocale(req);
  if (!locale) {
    locale = detectLocale(req) ?? DEFAULT_LOCALE;
    update = true;
  }
  sessionStorage.setItem("locale", locale);
  const resp = await ctx.next();
  if (update) {
    setLocale(resp, locale);
  }
  return resp;
}