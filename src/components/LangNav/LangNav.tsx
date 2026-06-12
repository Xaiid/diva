import { Lang } from "./LangNav.types";

function LangNav({
    lang,
    onChange,
  }: {
    lang: Lang;
    onChange: (l: Lang) => void;
  }) {
    return (
      <nav className="lang-nav" aria-label="Language selector">
        <button
          type="button"
          className={`lang-pill${lang === "en" ? " active" : ""}`}
          onClick={() => onChange("en")}
          aria-pressed={lang === "en"}
        >
          English
        </button>
        <button
          type="button"
          className={`lang-pill${lang === "es" ? " active" : ""}`}
          onClick={() => onChange("es")}
          aria-pressed={lang === "es"}
        >
          Español
        </button>
      </nav>
    );
  }

export default LangNav;