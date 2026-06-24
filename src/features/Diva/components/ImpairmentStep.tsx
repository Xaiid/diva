import { type Translations } from "../Diva.types";
import { type ImpairmentAnswers } from "../../../scoring";
import { Dispatch, SetStateAction } from "react";

export function ImpairmentStep({
    t,
    impairment,
    setImpairment
}: {
    t: Translations,
    impairment: ImpairmentAnswers,
    setImpairment: Dispatch<SetStateAction<ImpairmentAnswers>>
}) {
    const imp = t.impairment;

    return (
        <>
            <section>
                <h2 className="section-title">{imp.title}</h2>
                <p className="section-hint">{imp.hint}</p>
                <div className="question-block">
                    <label className="prompt">
                        <strong>{imp.adultQBefore}</strong> {imp.adultQMid}{" "}
                        <em>{imp.adultQEm}</em> {imp.adultQAfter}
                    </label>
                    <div className="yesno-row">
                        <button
                            type="button"
                            className={
                                impairment.adultTwoOrMoreDomains === true ? "chosen" : ""
                            }
                            onClick={() =>
                                setImpairment((i) => ({
                                    ...i,
                                    adultTwoOrMoreDomains: true,
                                }))
                            }
                        >
                            {t.yep}
                        </button>
                        <button
                            type="button"
                            className={
                                impairment.adultTwoOrMoreDomains === false ? "chosen" : ""
                            }
                            onClick={() =>
                                setImpairment((i) => ({
                                    ...i,
                                    adultTwoOrMoreDomains: false,
                                }))
                            }
                        >
                            {t.nope}
                        </button>
                    </div>
                </div>
                <div className="question-block">
                    <label className="prompt">
                        <strong>{imp.childQBefore}</strong> {imp.childQMid}{" "}
                        <em>{imp.childQEm}</em> {imp.childQAfter}
                    </label>
                    <div className="yesno-row">
                        <button
                            type="button"
                            className={
                                impairment.childTwoOrMoreDomains === true ? "chosen" : ""
                            }
                            onClick={() =>
                                setImpairment((i) => ({
                                    ...i,
                                    childTwoOrMoreDomains: true,
                                }))
                            }
                        >
                            {t.yep}
                        </button>
                        <button
                            type="button"
                            className={
                                impairment.childTwoOrMoreDomains === false ? "chosen" : ""
                            }
                            onClick={() =>
                                setImpairment((i) => ({
                                    ...i,
                                    childTwoOrMoreDomains: false,
                                }))
                            }
                        >
                            {t.nope}
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}