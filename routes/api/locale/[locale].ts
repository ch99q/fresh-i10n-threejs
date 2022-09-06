import { HandlerContext } from "$fresh/server.ts";
import { setLocale } from "../../../locales/mod.ts";

export const handler = (_req: Request, ctx: HandlerContext): Response => {
  const resp = Response.json({
    status: "ok",
  });

  try {
    setLocale(resp, ctx.params.locale);
  } catch (e) {
    return Response.json({
      status: "error",
      message: e.message,
    })
  }
  return resp;
};
