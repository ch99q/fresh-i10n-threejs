import { Fluent } from "fluent";

const fluent = new Fluent();

await fluent.addTranslation({
  locales: ["en-US", "en"],
  isDefault: true,
  filePath: "./locales/en-US.ftl",
})

await fluent.addTranslation({
  locales: ["da-DK", "da"],
  filePath: "./locales/da-DK.ftl",
})

export default fluent;