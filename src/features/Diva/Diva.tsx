import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  THRESHOLD_ADULT_FORM,
  THRESHOLD_ADULT_RESEARCH,
  THRESHOLD_CHILD,
  buildSummary,
  countPresent,
  type CriterionEAnswers,
  type ImpairmentAnswers,
  type OnsetAnswers,
  type PhaseAnswers,
} from "../../scoring";
import {
  translations,
  INATTENTION_ES,
  HYPERACTIVITY_IMPULSIVITY_ES,
  INATTENTION,
  HYPERACTIVITY_IMPULSIVITY,
} from "../../data/divaContent";
import { LangNav, Lang } from "../../components/LangNav";
import { CriterionItem, type Translations } from "./Diva.types";
import { SymptomStep } from "./components";
import "../../App.css";

const STEPS = translations.en.steps;

function emptyPhase(items: CriterionItem[]): PhaseAnswers {
  const o: PhaseAnswers = {};
  for (const i of items) {
    o[i.id] = { adult: null, child: null };
  }
  return o;
}

function phaseComplete(answers: PhaseAnswers, items: CriterionItem[]): boolean {
  return items.every(
    (i) =>
      answers[i.id]?.adult !== null &&
      answers[i.id]?.child !== null
  );
}

function PeerQuestions({
  inattention,
  valueInattA,
  valueInattC,
  valueHiA,
  valueHiC,
  onInattA,
  onInattC,
  onHiA,
  onHiC,
  t,
}: {
  inattention: boolean;
  valueInattA: boolean | null;
  valueInattC: boolean | null;
  valueHiA: boolean | null;
  valueHiC: boolean | null;
  onInattA: (v: boolean) => void;
  onInattC: (v: boolean) => void;
  onHiA: (v: boolean) => void;
  onHiC: (v: boolean) => void;
  t: Translations;
}) {
  const p = t.peer;
  return (
    <>
      <h2 className="section-title">{p.title}</h2>
      <p className="section-hint">{p.hint}</p>
      {inattention && (
        <>
          <div className="question-block">
            <label className="prompt">{p.inattAdult}</label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattA === true ? "chosen" : ""}
                onClick={() => onInattA(true)}
              >
                {t.yep}
              </button>
              <button
                type="button"
                className={valueInattA === false ? "chosen" : ""}
                onClick={() => onInattA(false)}
              >
                {t.nope}
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">{p.inattChild}</label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattC === true ? "chosen" : ""}
                onClick={() => onInattC(true)}
              >
                {t.yep}
              </button>
              <button
                type="button"
                className={valueInattC === false ? "chosen" : ""}
                onClick={() => onInattC(false)}
              >
                {t.nope}
              </button>
            </div>
          </div>
        </>
      )}
      {!inattention && (
        <>
          <div className="question-block">
            <label className="prompt">{p.hiAdult}</label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiA === true ? "chosen" : ""}
                onClick={() => onHiA(true)}
              >
                {t.yep}
              </button>
              <button
                type="button"
                className={valueHiA === false ? "chosen" : ""}
                onClick={() => onHiA(false)}
              >
                {t.nope}
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">{p.hiChild}</label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiC === true ? "chosen" : ""}
                onClick={() => onHiC(true)}
              >
                {t.yep}
              </button>
              <button
                type="button"
                className={valueHiC === false ? "chosen" : ""}
                onClick={() => onHiC(false)}
              >
                {t.nope}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

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

function Diva() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  const inattItems = lang === "es" ? INATTENTION_ES : INATTENTION;
  const hiItems = lang === "es" ? HYPERACTIVITY_IMPULSIVITY_ES : HYPERACTIVITY_IMPULSIVITY;

  const steps = t.steps as readonly string[];

  const [step, setStep] = useState(0);
  const [inatt, setInatt] = useState(() => emptyPhase(INATTENTION));
  const [hi, setHi] = useState(() => emptyPhase(HYPERACTIVITY_IMPULSIVITY));

  const [moreInattAdult, setMoreInattAdult] = useState<boolean | null>(null);
  const [moreInattChild, setMoreInattChild] = useState<boolean | null>(null);
  const [moreHiAdult, setMoreHiAdult] = useState<boolean | null>(null);
  const [moreHiChild, setMoreHiChild] = useState<boolean | null>(null);

  const [onset, setOnset] = useState<OnsetAnswers>({
    lifelongPattern: null,
    onsetAgeNote: "",
  });

  const [impairment, setImpairment] = useState<ImpairmentAnswers>({
    adultTwoOrMoreDomains: null,
    childTwoOrMoreDomains: null,
  });

  const [criterionE, setCriterionE] = useState<CriterionEAnswers>({
    betterExplainedByOtherDisorder: null,
  });

  const inattComplete = phaseComplete(inatt, inattItems);
  const hiComplete = phaseComplete(hi, hiItems);

  const summary = useMemo(() => {
    const ic = countPresent(INATTENTION, inatt, "child");
    const ia = countPresent(INATTENTION, inatt, "adult");
    const hc = countPresent(HYPERACTIVITY_IMPULSIVITY, hi, "child");
    const ha = countPresent(HYPERACTIVITY_IMPULSIVITY, hi, "adult");
    return buildSummary(ic, ia, hc, ha, onset, impairment, criterionE);
  }, [inatt, hi, onset, impairment, criterionE]);

  function setPhase(
    setter: Dispatch<SetStateAction<PhaseAnswers>>,
    id: string,
    phase: "adult" | "child",
    value: boolean
  ) {
    setter((prev) => ({
      ...prev,
      [id]: { ...prev[id], [phase]: value },
    }));
  }

  function peerInattComplete() {
    return moreInattAdult !== null && moreInattChild !== null;
  }
  function peerHiComplete() {
    return moreHiAdult !== null && moreHiChild !== null;
  }

  function onsetComplete() {
    return onset.lifelongPattern !== null;
  }

  function impairmentComplete() {
    return (
      impairment.adultTwoOrMoreDomains !== null &&
      impairment.childTwoOrMoreDomains !== null
    );
  }

  function canAdvance(): boolean {
    switch (step) {
      case 0:
        return true;
      case 1:
        return inattComplete;
      case 2:
        return peerInattComplete();
      case 3:
        return hiComplete;
      case 4:
        return peerHiComplete();
      case 5:
        return onsetComplete();
      case 6:
        return impairmentComplete();
      case 7:
        return criterionE.betterExplainedByOtherDisorder !== null;
      default:
        return true;
    }
  }

  function next() {
    if (!canAdvance()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  const showResults = step === STEPS.length - 1;

  const d = t.disclaimer;
  const r = t.results;
  const imp = t.impairment;
  const ce = t.criterionE;
  const on = t.onset;

  return (
    <div className="app">
      <LangNav lang={lang} onChange={setLang} />
      
      <header className="app-header">
        <h1>{t.header.title}</h1>
        <p className="subtitle">{t.header.subtitle}</p>
      </header>

      {step === 0 && (
        <div className="disclaimer">
          <p>
            <strong>{d.p1Before}</strong>
            {d.p1After}{" "}
            <a
              href="https://www.divacenter.eu"
              target="_blank"
              rel="noreferrer"
            >
              divacenter.eu
            </a>
            .
          </p>
          <p style={{ marginBottom: 0 }}>
            {d.p2Before} <strong>{d.p2Adult}</strong> {d.p2Mid}{" "}
            <strong>{d.p2Child}</strong> {d.p2After}
          </p>
        </div>
      )}

      <nav className="step-nav" aria-label="Where you are in the quiz">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`step-pill${i === step ? " active" : ""}`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </nav>

      {step === 0 && (
        <section>
          <h2 className="section-title">{t.intro.title}</h2>
          <p className="section-hint">{t.intro.hint}</p>
        </section>
      )}

      {step === 1 && (
        <SymptomStep
          title={t.inattentionStep.title}
          hint={t.inattentionStep.hint}
          items={inattItems}
          answers={inatt}
          onChange={(id, ph, v) => setPhase(setInatt, id, ph, v)}
          t={t}
        />
      )}

      {step === 2 && (
        <PeerQuestions
          inattention
          valueInattA={moreInattAdult}
          valueInattC={moreInattChild}
          valueHiA={moreHiAdult}
          valueHiC={moreHiChild}
          onInattA={setMoreInattAdult}
          onInattC={setMoreInattChild}
          onHiA={setMoreHiAdult}
          onHiC={setMoreHiChild}
          t={t}
        />
      )}

      {step === 3 && (
        <SymptomStep
          title={t.hiStep.title}
          hint={t.hiStep.hint}
          items={hiItems}
          answers={hi}
          onChange={(id, ph, v) => setPhase(setHi, id, ph, v)}
          t={t}
        />
      )}

      {step === 4 && (
        <PeerQuestions
          inattention={false}
          valueInattA={moreInattAdult}
          valueInattC={moreInattChild}
          valueHiA={moreHiAdult}
          valueHiC={moreHiChild}
          onInattA={setMoreInattAdult}
          onInattC={setMoreInattChild}
          onHiA={setMoreHiAdult}
          onHiC={setMoreHiChild}
          t={t}
        />
      )}

      {step === 5 && (
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
      )}

      {step === 6 && (
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
      )}

      {step === 7 && (
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
                className={
                  criterionE.betterExplainedByOtherDisorder === true
                    ? "chosen"
                    : ""
                }
                onClick={() =>
                  setCriterionE({ betterExplainedByOtherDisorder: true })
                }
              >
                {ce.yeahMostly}
              </button>
              <button
                type="button"
                className={
                  criterionE.betterExplainedByOtherDisorder === false
                    ? "chosen"
                    : ""
                }
                onClick={() =>
                  setCriterionE({ betterExplainedByOtherDisorder: false })
                }
              >
                {ce.nahNotSure}
              </button>
            </div>
          </div>
        </section>
      )}

      {showResults && (
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
                  <>
                    {" "}
                    {r.lifelongNoNote} <em>{onset.onsetAgeNote.trim()}</em>
                  </>
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
                {r.adultCutoffPre}{THRESHOLD_ADULT_FORM}{r.adultCutoffSome}
                {THRESHOLD_ADULT_RESEARCH}
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
                {r.buzzyAdultCutoffPre}{THRESHOLD_ADULT_FORM}{r.buzzyAdultResearch}
                {THRESHOLD_ADULT_RESEARCH}
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
                  {moreInattAdult === null
                    ? "—"
                    : moreInattAdult
                      ? r.moreOften
                      : r.notMore}
                  {r.focusVsChild}{" "}
                  {moreInattChild === null
                    ? "—"
                    : moreInattChild
                      ? r.moreOften
                      : r.notMore}
                </span>
              </li>
              <li>
                <span className="mark ok">•</span>
                <span>
                  {r.buzzyVsAdult}{" "}
                  {moreHiAdult === null
                    ? "—"
                    : moreHiAdult
                      ? r.moreOften
                      : r.notMore}
                  {r.buzzyVsChild}{" "}
                  {moreHiChild === null
                    ? "—"
                    : moreHiChild
                      ? r.moreOften
                      : r.notMore}
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
                <span className={`mark ${summary.childMeetsA ? "ok" : "bad"}`}>
                  {markChar(summary.childMeetsA)}
                </span>
                <span>
                  {r.checkKidA} {summary.inattChild}{r.checkKidABuzzy}{" "}
                  {summary.hiChild}
                </span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.adultMeetsAForm ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.adultMeetsAForm)}
                </span>
                <span>
                  {r.checkAdultForm} {summary.inattAdult}{r.checkAdultFormBuzzy}{" "}
                  {summary.hiAdult}
                </span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.adultMeetsAResearch ? "ok" : "warn"
                  }`}
                >
                  {markChar(summary.adultMeetsAResearch)}
                </span>
                <span>
                  {r.checkAdultResearchPre}{THRESHOLD_ADULT_RESEARCH}
                  {r.checkAdultResearchEnd}
                </span>
              </li>
              <li>
                <span className={`mark ${markClass(summary.onsetOk)}`}>
                  {markChar(summary.onsetOk)}
                </span>
                <span>{r.checkOnset}</span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.adultImpairmentTwoDomains === true ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.adultImpairmentTwoDomains)}
                </span>
                <span>{r.checkAdultImpairment}</span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.childImpairmentTwoDomains === true ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.childImpairmentTwoDomains)}
                </span>
                <span>{r.checkChildImpairment}</span>
              </li>
              <li>
                <span className={`mark ${markClass(summary.criterionEOk)}`}>
                  {markChar(summary.criterionEOk)}
                </span>
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
                setImpairment({
                  adultTwoOrMoreDomains: null,
                  childTwoOrMoreDomains: null,
                });
                setCriterionE({ betterExplainedByOtherDisorder: null });
              }}
            >
              {t.clearFresh}
            </button>
          </div>
        </section>
      )}

      {!showResults && (
        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={back}>
              {t.back}
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={next}
            disabled={!canAdvance()}
          >
            {step === 0 ? t.letsGo : t.next}
          </button>
        </div>
      )}

      {!showResults && step > 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "1rem" }}>
          {!canAdvance() && t.tapEverything}
        </p>
      )}
    </div>
  );
}

export { Diva };

