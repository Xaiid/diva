import { useState } from "react";
import type { CriterionItem } from "../Diva.types";
import { useLang } from "../../../context/LanguageContext";
import { YesNoToggle } from "./YesNoToggle";

export function CriterionRow({
    item,
    adult,
    child,
    onChange,
  }: {
    item: CriterionItem;
    adult: boolean | null;
    child: boolean | null;
    onChange: (id: string, phase: "adult" | "child", value: boolean) => void;
  }) {
    const { t } = useLang();
    const [open, setOpen] = useState(false);

    return (
      <article className="criterion-card">
        <div className="code">{item.code}</div>
        <p className="title">{item.title}</p>
        <div className="phase-row">
          <span className="phase-label">{t.phaseAdult}</span>
          <YesNoToggle
            value={adult}
            onPick={(v) => onChange(item.id, "adult", v)}
          />
        </div>
        <div className="phase-row">
          <span className="phase-label">{t.phaseChild}</span>
          <YesNoToggle
            value={child}
            onPick={(v) => onChange(item.id, "child", v)}
          />
        </div>
        <button
          type="button"
          className="details-btn"
          onClick={() => setOpen((x) => !x)}
        >
          {open ? t.hideExamples : t.peekExamples}
        </button>
        {open && (
          <div className="examples">
            <strong>{t.adultExamplesLabel}</strong>
            <ul>
              {item.adultExamples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
            <strong>{t.childExamplesLabel}</strong>
            <ul>
              {item.childExamples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </article>
    );
  }
