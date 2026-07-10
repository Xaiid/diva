import { type OnsetAnswers } from "../DivaScoring";
import { Dispatch, SetStateAction } from "react";
import { useLang } from "../../../context/LanguageContext";

export function OnsetStep({
    onset,
    setOnset,
}: {
    onset: OnsetAnswers;
    setOnset: Dispatch<SetStateAction<OnsetAnswers>>;
}) {
    const { t } = useLang();
    const on = t.onset;

    return (
        <section>
            <h2 className="section-title">{on.title}</h2>
            <p className="section-hint">{on.hint}</p>
            <div className="question-block">
                <label className="prompt">{on.q1}</label>
                <div className="yesno-row">
                    <button
                        type="button"
                        className={onset.lifelongPattern === true ? "chosen" : ""}
                        onClick={() => setOnset((o) => ({ ...o, lifelongPattern: true }))}
                    >
                        {t.yeah}
                    </button>
                    <button
                        type="button"
                        className={onset.lifelongPattern === false ? "chosen" : ""}
                        onClick={() => setOnset((o) => ({ ...o, lifelongPattern: false }))}
                    >
                        {t.nah}
                    </button>
                </div>
            </div>
            {onset.lifelongPattern === false && (
                <div className="question-block">
                    <label className="prompt">{on.q2}</label>
                    <input
                        className="text-input"
                        value={onset.onsetAgeNote}
                        onChange={(e) => setOnset((o) => ({ ...o, onsetAgeNote: e.target.value }))}
                        placeholder={on.q2Placeholder}
                    />
                </div>
            )}
        </section>
    );
}
