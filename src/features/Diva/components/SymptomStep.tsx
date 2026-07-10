import type { CriterionItem } from "../Diva.types";
import type { PhaseAnswers } from "../DivaScoring";
import { useLang } from "../../../context/LanguageContext";
import { CriterionRow } from "./CriterionRow";

export function SymptomStep({
    title,
    hint,
    items,
    answers,
    onChange,
  }: {
    title: string;
    hint: string;
    items: CriterionItem[];
    answers: PhaseAnswers;
    onChange: (id: string, phase: "adult" | "child", value: boolean) => void;
  }) {
    const { t } = useLang();
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
          />
        ))}
      </>
    );
  }
