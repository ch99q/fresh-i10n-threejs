/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Counter from "../islands/Counter.tsx";
import Text from "../components/Text.tsx";

import Construction from "../islands/Construction.tsx";

export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <img
        src="/logo.svg"
        height="100px"
        alt="the fresh logo: a sliced lemon dripping with juice"
      />
      <Text
        class={tw`my-6`}
        path="welcome"
        attrs={{ to: "fresh" }}
      />
      <Counter start={3} />
      <Construction
        style={{
          aspectRatio: "16/9",
          width: "900px",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}
