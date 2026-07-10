import { type CriterionEAnswers } from "../DivaScoring";
import { Dispatch, SetStateAction } from "react";
import { useLang } from "../../../context/LanguageContext";

export function CriterionEStep({
    criterionE,
    setCriterionE,
}: {
    criterionE: CriterionEAnswers;
    setCriterionE: Dispatch<SetStateAction<CriterionEAnswers>>;
}) {
    const { t } = useLang();
    const ce = t.criterionE;

    return (
        <section>
            <h2 className="section-title">{ce.title}</h2>
            <p className="section-hint">{ce.hint}</p>
            <div className="question-block">
                <label className="prompt">
                    {ce.qBefore} <strong>{ce.qEm}</strong> {ce.qAfter}
                </label>
                <div className="yesno-row">
                    <button
                        type="button"
                        className={criterionE.betterExplainedByOtherDisorder === true ? "chosen" : ""}
                        onClick={() => setCriterionE({ betterExplainedByOtherDisorder: true })}
                    >
                        {ce.yeahMostly}
                    </button>
                    <button
                        type="button"
                        className={criterionE.betterExplainedByOtherDisorder === false ? "chosen" : ""}
                        onClick={() => setCriterionE({ betterExplainedByOtherDisorder: false })}
                    >
                        {ce.nahNotSure}
                    </button>
                </div>
            </div>
        </section>
    );
}
