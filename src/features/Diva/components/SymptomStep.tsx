import type { CriterionItem, Translations } from "../Diva.types";
import type { PhaseAnswers } from "../../../scoring.ts";
import { CriterionRow } from "./CriterionRow";

export function SymptomStep({
    title,
    hint,
    items,
    answers,
    onChange,
    t,
  }: {
    title: string;
    hint: string;
    items: CriterionItem[];
    answers: PhaseAnswers;
    onChange: (id: string, phase: "adult" | "child", value: boolean) => void;
    t: Translations;
  }) {
    return (
      <>
        <h2 className="section-title">{title}</h2>
        <p className="section-hint">{hint}</p>
        <p className="section-hint" style={{ fontSize: "0.8rem" }}>
          {t.footnoteInterest}
        </p>
        {items.map((item) => (
          <CriterionRow
            key={item.id}
            item={item}
            adult={answers[item.id]?.adult ?? null}
            child={answers[item.id]?.child ?? null}
            onChange={onChange}
            t={t}
          />
        ))}
      </>
    );
  }