import { useState, useEffect } from "preact/hooks";

export function useLocale(): [string, (locale: string) => void] {
  const [locale, setLocale] = useState(sessionStorage.getItem("locale") as string);
  useEffect(() => {
    sessionStorage.setItem("locale", locale);
  }, [locale]);
  function setLocaleAndStore(locale: string) {
    fetch("/api/locale/" + locale, {})
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setLocale(locale);
        } else {
          throw new Error(data.message);
        }
      });
  }
  return [locale, setLocaleAndStore];
}