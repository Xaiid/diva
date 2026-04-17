import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  FOOTNOTE_INTEREST,
  HYPERACTIVITY_IMPULSIVITY,
  INATTENTION,
  type CriterionItem,
} from "./data/divaContent";
import {
  THRESHOLD_ADULT_FORM,
  THRESHOLD_ADULT_RESEARCH,
  THRESHOLD_CHILD,
  buildSummary,
  countPresent,
  subtypeLabel,
  type CriterionEAnswers,
  type ImpairmentAnswers,
  type OnsetAnswers,
  type PhaseAnswers,
} from "./scoring";
import "./App.css";

const STEPS = [
  "Intro",
  "Inattention",
  "Inattention (peers)",
  "Hyperactivity / impulsivity",
  "H/I (peers)",
  "Onset",
  "Impairment",
  "Other causes",
  "Results",
] as const;

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

function SymptomStep({
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
  return (
    <>
      <h2 className="section-title">{title}</h2>
      <p className="section-hint">{hint}</p>
      <p className="section-hint" style={{ fontSize: "0.8rem" }}>
        {FOOTNOTE_INTEREST}
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

function CriterionRow({
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
  const [open, setOpen] = useState(false);

  return (
    <article className="criterion-card">
      <div className="code">{item.code}</div>
      <p className="title">{item.title}</p>
      <div className="phase-row">
        <span className="phase-label">Adulthood (past ~6 months or more)</span>
        <YesNoToggle
          value={adult}
          onPick={(v) => onChange(item.id, "adult", v)}
        />
      </div>
      <div className="phase-row">
        <span className="phase-label">Childhood (ages 5–12)</span>
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
        {open ? "Hide examples" : "Show example behaviours (from DIVA)"}
      </button>
      {open && (
        <div className="examples">
          <strong>Adulthood examples</strong>
          <ul>
            {item.adultExamples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
          <strong>Childhood examples</strong>
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

function YesNoToggle({
  value,
  onPick,
}: {
  value: boolean | null;
  onPick: (v: boolean) => void;
}) {
  return (
    <div className="toggle-group">
      <button
        type="button"
        className={value === true ? "selected-yes" : ""}
        onClick={() => onPick(true)}
      >
        Yes
      </button>
      <button
        type="button"
        className={value === false ? "selected-no" : ""}
        onClick={() => onPick(false)}
      >
        No
      </button>
    </div>
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
}) {
  return (
    <>
      <h2 className="section-title">Compared with others</h2>
      <p className="section-hint">
        DIVA also asks whether these behaviours occur more often or more
        intensely than in most peers of the same age and ability. Answer for
        the same period as above.
      </p>
      {inattention && (
        <>
          <div className="question-block">
            <label className="prompt">
              <strong>Inattention:</strong> Did you show more of these
              inattentive behaviours than most adults, or more often than most
              adults?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattA === true ? "chosen" : ""}
                onClick={() => onInattA(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={valueInattA === false ? "chosen" : ""}
                onClick={() => onInattA(false)}
              >
                No
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Inattention:</strong> As a child, did you show more of
              these behaviours than most children your age, or more often?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattC === true ? "chosen" : ""}
                onClick={() => onInattC(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={valueInattC === false ? "chosen" : ""}
                onClick={() => onInattC(false)}
              >
                No
              </button>
            </div>
          </div>
        </>
      )}
      {!inattention && (
        <>
          <div className="question-block">
            <label className="prompt">
              <strong>Hyperactivity / impulsivity:</strong> Do you show more of
              these behaviours than most adults, or more often?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiA === true ? "chosen" : ""}
                onClick={() => onHiA(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={valueHiA === false ? "chosen" : ""}
                onClick={() => onHiA(false)}
              >
                No
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Hyperactivity / impulsivity:</strong> As a child, did you
              show more than most children your age, or more often?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiC === true ? "chosen" : ""}
                onClick={() => onHiC(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={valueHiC === false ? "chosen" : ""}
                onClick={() => onHiC(false)}
              >
                No
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

export default function App() {
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

  const inattComplete = phaseComplete(inatt, INATTENTION);
  const hiComplete = phaseComplete(hi, HYPERACTIVITY_IMPULSIVITY);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>DIVA-style ADHD symptom review</h1>
        <p className="subtitle">
          Structured questions based on the{" "}
          <em>Diagnostic Interview for ADHD in Adults (DIVA)</em> and DSM-IV
          criteria. English interface; not a substitute for clinical assessment.
        </p>
      </header>

      {step === 0 && (
        <div className="disclaimer">
          <p>
            <strong>Not a diagnosis.</strong> This app is for education and
            self-reflection only. ADHD assessment requires a qualified clinician,
            collateral history where possible, and consideration of other
            conditions. Official materials and updates:{" "}
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
            Answer each criterion for <strong>adulthood</strong> (roughly the
            last six months or more) and for <strong>childhood</strong> (ages
            5–12), as in the paper DIVA interview.
          </p>
        </div>
      )}

      <nav className="step-nav" aria-label="Progress">
        {STEPS.map((label, i) => (
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
          <h2 className="section-title">Before you begin</h2>
          <p className="section-hint">
            You will go through inattention items (9), hyperactivity–impulsivity
            items (9), brief questions on onset and life impairment, and a
            reminder about other mental health conditions. At the end you will
            see a summary aligned with the DIVA scoring sheet (symptom counts and
            DSM-IV-style presentation labels).
          </p>
        </section>
      )}

      {step === 1 && (
        <SymptomStep
          title="Part 1 — Inattention (DSM-IV criterion A1)"
          hint="Mark Yes only if the pattern is chronic rather than short-lived, and more frequent or intense than expected for people of similar age and ability, or clearly linked to impairment."
          items={INATTENTION}
          answers={inatt}
          onChange={(id, ph, v) => setPhase(setInatt, id, ph, v)}
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
        />
      )}

      {step === 3 && (
        <SymptomStep
          title="Part 2 — Hyperactivity / impulsivity (DSM-IV criterion A2)"
          hint="Same rules: chronic pattern; compare frequency and intensity to peers; Yes if clearly present."
          items={HYPERACTIVITY_IMPULSIVITY}
          answers={hi}
          onChange={(id, ph, v) => setPhase(setHi, id, ph, v)}
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
        />
      )}

      {step === 5 && (
        <section>
          <h2 className="section-title">Onset and course (DSM-IV criterion B)</h2>
          <p className="section-hint">
            Have these kinds of symptoms been present for most of your life, with
            some signs clearly before age 7 (as required by DSM-IV for ADHD)?
          </p>
          <div className="question-block">
            <label className="prompt">
              Would you say you had a lifelong pattern, with several symptoms
              already before age 7?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={onset.lifelongPattern === true ? "chosen" : ""}
                onClick={() =>
                  setOnset((o) => ({ ...o, lifelongPattern: true }))
                }
              >
                Yes
              </button>
              <button
                type="button"
                className={onset.lifelongPattern === false ? "chosen" : ""}
                onClick={() =>
                  setOnset((o) => ({ ...o, lifelongPattern: false }))
                }
              >
                No / unsure
              </button>
            </div>
          </div>
          {onset.lifelongPattern === false && (
            <div className="question-block">
              <label className="prompt">
                If symptoms started mainly later, at what age did they begin to
                affect you in a clear, ongoing way? (approximate is fine)
              </label>
              <input
                className="text-input"
                value={onset.onsetAgeNote}
                onChange={(e) =>
                  setOnset((o) => ({ ...o, onsetAgeNote: e.target.value }))
                }
                placeholder="e.g. around 12, or after starting university"
              />
            </div>
          )}
        </section>
      )}

      {step === 6 && (
        <section>
          <h2 className="section-title">
            Impairment across life areas (DSM-IV criteria C and D)
          </h2>
          <p className="section-hint">
            DIVA checks whether problems linked to these symptoms caused clear
            difficulties in at least two areas (for example work or study,
            family, social life, leisure, self-esteem). Answer separately for
            adulthood and childhood.
          </p>
          <div className="question-block">
            <label className="prompt">
              <strong>Adulthood:</strong> Have these symptoms been linked to
              meaningful problems in <em>two or more</em> major life areas?
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
                Yes
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
                No
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Childhood:</strong> Did these kinds of problems show up in{" "}
              <em>two or more</em> important areas (school, family, friends,
              hobbies, self-esteem)?
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
                Yes
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
                No
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 7 && (
        <section>
          <h2 className="section-title">Other explanations (DSM-IV criterion E)</h2>
          <p className="section-hint">
            Symptoms must not be better accounted for by another psychiatric
            disorder (for example severe depression, bipolar disorder, anxiety
            disorder, substance use, or another condition). This is a rough
            self-check only.
          </p>
          <div className="question-block">
            <label className="prompt">
              Do you believe another mental health condition fully explains these
              difficulties better than ADHD would?
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
                Yes
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
                No / unsure
              </button>
            </div>
          </div>
        </section>
      )}

      {showResults && (
        <section>
          <div className="results-hero">
            <h2>Your summary</h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>
              Symptom counts only — interpretation belongs with a clinician.
            </p>
            {onset.lifelongPattern === true && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                Onset: you indicated a <strong>lifelong</strong> pattern with
                signs before age 7 (DSM-IV style).
              </p>
            )}
            {onset.lifelongPattern === false && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                Onset: you indicated symptoms may <strong>not</strong> fit a
                clear lifelong pattern before age 7.
                {onset.onsetAgeNote.trim() ? (
                  <>
                    {" "}
                    Note: <em>{onset.onsetAgeNote.trim()}</em>
                  </>
                ) : null}{" "}
                A clinician would explore developmental history in more detail.
              </p>
            )}
          </div>

          <div className="results-grid two" style={{ marginBottom: "1rem" }}>
            <div className="stat-card">
              <h3>Inattention — childhood</h3>
              <div className="big">
                {summary.inattChild} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Threshold in DIVA / DSM-IV child: ≥{THRESHOLD_CHILD}
              </p>
            </div>
            <div className="stat-card">
              <h3>Inattention — adult</h3>
              <div className="big">
                {summary.inattAdult} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                DIVA form threshold: ≥{THRESHOLD_ADULT_FORM} (research often uses
                ≥{THRESHOLD_ADULT_RESEARCH})
              </p>
            </div>
            <div className="stat-card">
              <h3>Hyperactivity / impulsivity — childhood</h3>
              <div className="big">
                {summary.hiChild} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Threshold: ≥{THRESHOLD_CHILD}
              </p>
            </div>
            <div className="stat-card">
              <h3>Hyperactivity / impulsivity — adult</h3>
              <div className="big">
                {summary.hiAdult} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                DIVA form: ≥{THRESHOLD_ADULT_FORM}; research: ≥
                {THRESHOLD_ADULT_RESEARCH}
              </p>
            </div>
          </div>

          <div className="stat-card" style={{ marginBottom: "1rem" }}>
            <h3>Compared with peers (your answers)</h3>
            <ul className="checklist">
              <li>
                <span className="mark ok">•</span>
                <span>
                  Inattention vs peers — adult:{" "}
                  {moreInattAdult === null
                    ? "—"
                    : moreInattAdult
                      ? "more / more often"
                      : "not more"}
                  ; childhood:{" "}
                  {moreInattChild === null
                    ? "—"
                    : moreInattChild
                      ? "more / more often"
                      : "not more"}
                </span>
              </li>
              <li>
                <span className="mark ok">•</span>
                <span>
                  Hyperactivity / impulsivity vs peers — adult:{" "}
                  {moreHiAdult === null
                    ? "—"
                    : moreHiAdult
                      ? "more / more often"
                      : "not more"}
                  ; childhood:{" "}
                  {moreHiChild === null
                    ? "—"
                    : moreHiChild
                      ? "more / more often"
                      : "not more"}
                </span>
              </li>
            </ul>
          </div>

          <div className="stat-card" style={{ marginBottom: "1rem" }}>
            <h3>Adult presentation (by symptom count)</h3>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>
              Using ≥{THRESHOLD_ADULT_FORM} per domain:{" "}
              <strong>{subtypeLabel(summary.subtypeAdultForm)}</strong>
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--muted)" }}>
              Using ≥{THRESHOLD_ADULT_RESEARCH} per domain (research suggestion in
              DIVA materials):{" "}
              <strong>{subtypeLabel(summary.subtypeAdultResearch)}</strong>
            </p>
          </div>

          <div className="stat-card">
            <h3>Checklist style overview</h3>
            <ul className="checklist">
              <li>
                <span className={`mark ${summary.childMeetsA ? "ok" : "bad"}`}>
                  {markChar(summary.childMeetsA)}
                </span>
                <span>
                  Childhood: six or more symptoms in the inattention list and/or
                  six or more in the hyperactivity–impulsivity list (your counts:
                  inattention {summary.inattChild}, H/I {summary.hiChild})
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
                  Adulthood (DIVA form threshold): at least six in one domain
                  (inattention {summary.inattAdult}, H/I {summary.hiAdult})
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
                  Adulthood (research threshold ≥{THRESHOLD_ADULT_RESEARCH} per
                  domain, informational)
                </span>
              </li>
              <li>
                <span className={`mark ${markClass(summary.onsetOk)}`}>
                  {markChar(summary.onsetOk)}
                </span>
                <span>
                  Lifelong pattern with onset before ~7 years (criterion B, as you
                  answered)
                </span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.adultImpairmentTwoDomains === true ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.adultImpairmentTwoDomains)}
                </span>
                <span>Adulthood: impairment in ≥2 life areas</span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.childImpairmentTwoDomains === true ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.childImpairmentTwoDomains)}
                </span>
                <span>Childhood: impairment in ≥2 life areas</span>
              </li>
              <li>
                <span
                  className={`mark ${markClass(
                    summary.criterionEOk,
                    true
                  )}`}
                >
                  {markChar(summary.criterionEOk, true)}
                </span>
                <span>
                  Symptoms not fully better explained by another disorder (your
                  self-check; ✓ means you answered &quot;No / unsure&quot; to
                  other disorder fully explaining things)
                </span>
              </li>
            </ul>
          </div>

          <div className="disclaimer" style={{ marginTop: "1.5rem" }}>
            <p style={{ marginTop: 0 }}>
              If several items are positive, consider discussing the result with
              a mental health professional experienced in adult ADHD. If you are
              in crisis, contact local emergency services or a crisis line
              immediately.
            </p>
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
              Start over
            </button>
          </div>
        </section>
      )}

      {!showResults && (
        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={back}>
              Back
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={next}
            disabled={!canAdvance()}
          >
            {step === 0 ? "Begin" : "Continue"}
          </button>
        </div>
      )}

      {!showResults && step > 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "1rem" }}>
          {!canAdvance() &&
            "Please answer every question on this page before continuing."}
        </p>
      )}
    </div>
  );
}
