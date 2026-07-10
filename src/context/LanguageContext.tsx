import { createContext, useContext, useState } from "react";
import { translations } from "../features/Diva/DivaContent";
import { Lang } from "../components/LangNav/LangNav.types";

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations[Lang];
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}