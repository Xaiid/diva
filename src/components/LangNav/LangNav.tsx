import { useLang } from "../../context/LanguageContext";

function LangNav() {
  const { lang, setLang } = useLang();
  return (
    <nav className="lang-nav" aria-label="Language selector">
      <button
        type="button"
        className={`lang-pill${lang === "en" ? " active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
      >
        English
      </button>
      <button
        type="button"
        className={`lang-pill${lang === "es" ? " active" : ""}`}
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
      >
        Español
      </button>
    </nav>
  );
}

export { LangNav };