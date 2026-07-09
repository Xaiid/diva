import { type Translations } from "../Diva.types";
import { type OnsetAnswers } from "../../../scoring";
import { Dispatch, SetStateAction } from "react";

export function OnsetStep({ 
    t,
    onset,
    setOnset,
}: {
    t: Translations;
    onset: OnsetAnswers;
    setOnset: Dispatch<SetStateAction<OnsetAnswers>>;
}) {
    const on = t.onset;

    return (
        <>
            <section>
                <h2 className="section-title">{on.title}</h2>
                <p className="section-hint">{on.hint}</p>
                <div className="question-block">
                    <label className="prompt">{on.q1}</label>
                    <div className="yesno-row">
                        <button
                            type="button"
                            className={onset.lifelongPattern === true ? "chosen" : ""}
                            onClick={() =>
                                setOnset((o) => ({ ...o, lifelongPattern: true }))
                            }
                        >
                            {t.yeah}
                        </button>
                        <button
                            type="button"
                            className={onset.lifelongPattern === false ? "chosen" : ""}
                            onClick={() =>
                                setOnset((o) => ({ ...o, lifelongPattern: false }))
                            }
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
                            onChange={(e) =>
                                setOnset((o) => ({ ...o, onsetAgeNote: e.target.value }))
                            }
                            placeholder={on.q2Placeholder}
                        />
                    </div>
                )}
            </section>
        </>
    );
}