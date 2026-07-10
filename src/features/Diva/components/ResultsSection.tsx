import { Dispatch, SetStateAction } from "react";
import { useLang } from "../../../context/LanguageContext";
import { INATTENTION, HYPERACTIVITY_IMPULSIVITY } from "../DivaContent";
import { CriterionEAnswers, ImpairmentAnswers, OnsetAnswers, PhaseAnswers, ScoringSummary, THRESHOLD_ADULT_FORM, THRESHOLD_ADULT_RESEARCH, THRESHOLD_CHILD } from "../DivaScoring";
import { emptyPhase } from "../hooks/useDivaState";

function markChar(ok: boolean | null, invert = false): string {
    if (ok === null) return "—";
    const v = invert ? !ok : ok;
    return v ? "✓" : "✗";
}

function markClass(ok: boolean | null, invert = false): string {
    if (ok === null) return "warn";
    const v = invert ? !ok : ok;
    return v ? "ok" : "bad";
}

export function ResultsSection({
    summary,
    onset,
    moreInattAdult,
    moreInattChild,
    moreHiAdult,
    moreHiChild,
    setOnset,
    setStep,
    setInatt,
    setHi,
    setMoreInattAdult,
    setMoreInattChild,
    setMoreHiAdult,
    setMoreHiChild,
    setImpairment,
    setCriterionE,
}: {
    summary: ScoringSummary;
    onset: OnsetAnswers;
    moreInattAdult: boolean | null;
    moreInattChild: boolean | null;
    moreHiAdult: boolean | null;
    moreHiChild: boolean | null;
    setOnset: Dispatch<SetStateAction<OnsetAnswers>>;
    setStep: Dispatch<SetStateAction<number>>;
    setInatt: Dispatch<SetStateAction<PhaseAnswers>>;
    setHi: Dispatch<SetStateAction<PhaseAnswers>>;
    setMoreInattAdult: Dispatch<SetStateAction<boolean | null>>;
    setMoreInattChild: Dispatch<SetStateAction<boolean | null>>;
    setMoreHiAdult: Dispatch<SetStateAction<boolean | null>>;
    setMoreHiChild: Dispatch<SetStateAction<boolean | null>>;
    setImpairment: Dispatch<SetStateAction<ImpairmentAnswers>>;
    setCriterionE: Dispatch<SetStateAction<CriterionEAnswers>>;
}) {
    const { t } = useLang();
    const r = t.results;

    return (
        <section>
            <div className="results-hero">
                <h2>{r.heroTitle}</h2>
                <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>
                    {r.heroSubtitle}
                </p>
                {onset.lifelongPattern === true && (
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                        {r.lifelongYes}
                    </p>
                )}
                {onset.lifelongPattern === false && (
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                        {r.lifelongNoBefore} <strong>{r.lifelongNoEm}</strong>{" "}
                        {r.lifelongNoAfter}
                        {onset.onsetAgeNote.trim() ? (
                            <> {r.lifelongNoNote} <em>{onset.onsetAgeNote.trim()}</em></>
                        ) : null}{" "}
                        {r.lifelongNoEnd}
                    </p>
                )}
            </div>

            <div className="results-grid two" style={{ marginBottom: "1rem" }}>
                <div className="stat-card">
                    <h3>{r.focusKid}</h3>
                    <div className="big">{summary.inattChild} / 9</div>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                        {r.kidCutoff}{THRESHOLD_CHILD}{r.inDomain}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>{r.focusAdult}</h3>
                    <div className="big">{summary.inattAdult} / 9</div>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                        {r.adultCutoffPre}{THRESHOLD_ADULT_FORM}{r.adultCutoffSome}{THRESHOLD_ADULT_RESEARCH}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>{r.buzzyKid}</h3>
                    <div className="big">{summary.hiChild} / 9</div>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                        {r.buzzyKidCutoff}{THRESHOLD_CHILD}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>{r.buzzyAdult}</h3>
                    <div className="big">{summary.hiAdult} / 9</div>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                        {r.buzzyAdultCutoffPre}{THRESHOLD_ADULT_FORM}{r.buzzyAdultResearch}{THRESHOLD_ADULT_RESEARCH}
                    </p>
                </div>
            </div>

            <div className="stat-card" style={{ marginBottom: "1rem" }}>
                <h3>{r.vsOthersTitle}</h3>
                <ul className="checklist">
                    <li>
                        <span className="mark ok">•</span>
                        <span>
                            {r.focusVsAdult}{" "}
                            {moreInattAdult === null ? "—" : moreInattAdult ? r.moreOften : r.notMore}
                            {r.focusVsChild}{" "}
                            {moreInattChild === null ? "—" : moreInattChild ? r.moreOften : r.notMore}
                        </span>
                    </li>
                    <li>
                        <span className="mark ok">•</span>
                        <span>
                            {r.buzzyVsAdult}{" "}
                            {moreHiAdult === null ? "—" : moreHiAdult ? r.moreOften : r.notMore}
                            {r.buzzyVsChild}{" "}
                            {moreHiChild === null ? "—" : moreHiChild ? r.moreOften : r.notMore}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="stat-card" style={{ marginBottom: "1rem" }}>
                <h3>{r.flavourTitle}</h3>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>
                    {r.flavourStrictPre}{THRESHOLD_ADULT_FORM}{r.flavourStrictEnd}{" "}
                    <strong>{r[summary.subtypeAdultForm]}</strong>
                </p>
                <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--muted)" }}>
                    {r.flavourSoftPre}{THRESHOLD_ADULT_RESEARCH}{r.flavourSoftEnd}{" "}
                    <strong>{r[summary.subtypeAdultResearch]}</strong>
                </p>
            </div>

            <div className="stat-card">
                <h3>{r.checklistTitle}</h3>
                <ul className="checklist">
                    <li>
                        <span className={`mark ${summary.childMeetsA ? "ok" : "bad"}`}>{markChar(summary.childMeetsA)}</span>
                        <span>{r.checkKidA} {summary.inattChild}{r.checkKidABuzzy} {summary.hiChild}</span>
                    </li>
                    <li>
                        <span className={`mark ${summary.adultMeetsAForm ? "ok" : "bad"}`}>{markChar(summary.adultMeetsAForm)}</span>
                        <span>{r.checkAdultForm} {summary.inattAdult}{r.checkAdultFormBuzzy} {summary.hiAdult}</span>
                    </li>
                    <li>
                        <span className={`mark ${summary.adultMeetsAResearch ? "ok" : "warn"}`}>{markChar(summary.adultMeetsAResearch)}</span>
                        <span>{r.checkAdultResearchPre}{THRESHOLD_ADULT_RESEARCH}{r.checkAdultResearchEnd}</span>
                    </li>
                    <li>
                        <span className={`mark ${markClass(summary.onsetOk)}`}>{markChar(summary.onsetOk)}</span>
                        <span>{r.checkOnset}</span>
                    </li>
                    <li>
                        <span className={`mark ${summary.adultImpairmentTwoDomains === true ? "ok" : "bad"}`}>{markChar(summary.adultImpairmentTwoDomains)}</span>
                        <span>{r.checkAdultImpairment}</span>
                    </li>
                    <li>
                        <span className={`mark ${summary.childImpairmentTwoDomains === true ? "ok" : "bad"}`}>{markChar(summary.childImpairmentTwoDomains)}</span>
                        <span>{r.checkChildImpairment}</span>
                    </li>
                    <li>
                        <span className={`mark ${markClass(summary.criterionEOk)}`}>{markChar(summary.criterionEOk)}</span>
                        <span>
                            {r.checkCriterionEBefore} <em>{r.checkCriterionEEm}</em>{" "}
                            {r.checkCriterionEAfter}
                        </span>
                    </li>
                </ul>
            </div>

            <div className="disclaimer" style={{ marginTop: "1.5rem" }}>
                <p style={{ marginTop: 0 }}>{r.closingNote}</p>
            </div>

            <div className="actions">
                <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                        setStep(0);
                        setInatt(emptyPhase(INATTENTION));
                        setHi(emptyPhase(HYPERACTIVITY_IMPULSIVITY));
                        setMoreInattAdult(null);
                        setMoreInattChild(null);
                        setMoreHiAdult(null);
                        setMoreHiChild(null);
                        setOnset({ lifelongPattern: null, onsetAgeNote: "" });
                        setImpairment({ adultTwoOrMoreDomains: null, childTwoOrMoreDomains: null });
                        setCriterionE({ betterExplainedByOtherDisorder: null });
                    }}
                >
                    {t.clearFresh}
                </button>
            </div>
        </section>
    );
}
