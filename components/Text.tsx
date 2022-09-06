/** @jsx h */
import { h } from "preact";

import type { TranslationContext } from "fluent";
import fluent from "../fluent.config.ts";

export default function Text(
  { attrs, locale, path, ...props }:
    & h.JSX.HTMLAttributes<HTMLParagraphElement>
    & {
      attrs: TranslationContext;
      locale?: string | string[];
      path: string;
    },
) {
  const output = fluent.translate(
    locale ?? sessionStorage.getItem("locale") as string,
    path,
    attrs,
  );

  return (
    <p
      {...props}
    >
      {output ?? props.children}
    </p>
  );
}
