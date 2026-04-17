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
  "Hi",
  "Focus",
  "You vs others",
  "Buzz & blurts",
  "Still vs others",
  "Way back when",
  "Real-life mess",
  "Other stuff?",
  "Recap",
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
        <span className="phase-label">Grown-up you (~last 6+ months)</span>
        <YesNoToggle
          value={adult}
          onPick={(v) => onChange(item.id, "adult", v)}
        />
      </div>
      <div className="phase-row">
        <span className="phase-label">Kid you (ages 5–12)</span>
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
        {open ? "Hide examples" : "Peek at example behaviours ✨"}
      </button>
      {open && (
        <div className="examples">
          <strong>Grown-up examples</strong>
          <ul>
            {item.adultExamples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
          <strong>Kid-era examples</strong>
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
        Yep
      </button>
      <button
        type="button"
        className={value === false ? "selected-no" : ""}
        onClick={() => onPick(false)}
      >
        Nope
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
      <h2 className="section-title">Compared with other people</h2>
      <p className="section-hint">
        Quick vibe check: did this stuff show up more often or more intensely
        than for other people your age (and kinda similar smarts / situation)?
        Same time periods as before.
      </p>
      {inattention && (
        <>
          <div className="question-block">
            <label className="prompt">
              <strong>Focus / attention:</strong> as a grown-up, was this more
              than for most adults (or more often)?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattA === true ? "chosen" : ""}
                onClick={() => onInattA(true)}
              >
                Yep
              </button>
              <button
                type="button"
                className={valueInattA === false ? "chosen" : ""}
                onClick={() => onInattA(false)}
              >
                Nope
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Focus / attention:</strong> as a kid, more than for most
              kids your age (or more often)?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueInattC === true ? "chosen" : ""}
                onClick={() => onInattC(true)}
              >
                Yep
              </button>
              <button
                type="button"
                className={valueInattC === false ? "chosen" : ""}
                onClick={() => onInattC(false)}
              >
                Nope
              </button>
            </div>
          </div>
        </>
      )}
      {!inattention && (
        <>
          <div className="question-block">
            <label className="prompt">
              <strong>Buzzy / impulsive side:</strong> now, more than for most
              adults (or more often)?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiA === true ? "chosen" : ""}
                onClick={() => onHiA(true)}
              >
                Yep
              </button>
              <button
                type="button"
                className={valueHiA === false ? "chosen" : ""}
                onClick={() => onHiA(false)}
              >
                Nope
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Buzzy / impulsive side:</strong> as a kid, more than for
              most kids your age (or more often)?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={valueHiC === true ? "chosen" : ""}
                onClick={() => onHiC(true)}
              >
                Yep
              </button>
              <button
                type="button"
                className={valueHiC === false ? "chosen" : ""}
                onClick={() => onHiC(false)}
              >
                Nope
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
        <h1>DIVA check-in</h1>
        <p className="subtitle">
          Loosely based on the grown-up ADHD interview{" "}
          <em>(DIVA)</em> + old-school DSM-IV ideas — just a cozy English walkthrough,
          not a doctor visit.
        </p>
      </header>

      {step === 0 && (
        <div className="disclaimer">
          <p>
            <strong>Heads up: not a diagnosis.</strong> This is for curiosity and
            learning about yourself. Real ADHD assessment = actual human
            professional, sometimes family/school stories, ruling other stuff out.
            Official DIVA things live at{" "}
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
            For each item, tap how it fits <strong>grown-up you</strong> (think
            last ~6 months-ish) and <strong>kid you</strong> (ages 5–12), same as
            the paper interview flow.
          </p>
        </div>
      )}

      <nav className="step-nav" aria-label="Where you are in the quiz">
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
          <h2 className="section-title">So what happens here?</h2>
          <p className="section-hint">
            Nine “focus brain” items, nine “buzzy / blurty” ones, a few questions
            about how long it’s been going on and where life got messy, then a
            chill recap with counts (like the DIVA score sheet vibes, but pink).
          </p>
        </section>
      )}

      {step === 1 && (
        <SymptomStep
          title="Part 1 — Focus & attention slip-ups"
          hint="Tap Yep if it’s been a long-running thing (not just a stressed week), happens more than for similar people your age, or really messes with life. Otherwise Nope is totally fine."
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
          title="Part 2 — Buzzy body & impulsive moments"
          hint="Same vibe: ongoing pattern, more than peers, or actually causes problems → Yep. Otherwise Nope."
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
          <h2 className="section-title">Way back when — how long has this been a thing?</h2>
          <p className="section-hint">
            Old DSM-IV cared a lot about “since childhood” and hints before age 7.
            We’re not judging — just mapping what it felt like for you.
          </p>
          <div className="question-block">
            <label className="prompt">
              Does it feel like this has been with you most of your life, with
              several signs already before age 7?
            </label>
            <div className="yesno-row">
              <button
                type="button"
                className={onset.lifelongPattern === true ? "chosen" : ""}
                onClick={() =>
                  setOnset((o) => ({ ...o, lifelongPattern: true }))
                }
              >
                Yeah, pretty much
              </button>
              <button
                type="button"
                className={onset.lifelongPattern === false ? "chosen" : ""}
                onClick={() =>
                  setOnset((o) => ({ ...o, lifelongPattern: false }))
                }
              >
                Nah / not really sure
              </button>
            </div>
          </div>
          {onset.lifelongPattern === false && (
            <div className="question-block">
              <label className="prompt">
                If it kicked in later, when do you think it started sticking around
                in a real way? Ballpark is fine.
              </label>
              <input
                className="text-input"
                value={onset.onsetAgeNote}
                onChange={(e) =>
                  setOnset((o) => ({ ...o, onsetAgeNote: e.target.value }))
                }
                placeholder="e.g. ~12, uni, first job…"
              />
            </div>
          )}
        </section>
      )}

      {step === 6 && (
        <section>
          <h2 className="section-title">Where did it actually make life wobbly?</h2>
          <p className="section-hint">
            Think work/school, home, friends, hobbies, how you feel about yourself
            — DIVA-style, we’re asking if stuff spilled into{" "}
            <em>two or more</em> big areas. No shame either way.
          </p>
          <div className="question-block">
            <label className="prompt">
              <strong>Grown-up era:</strong> did this pattern tie to real problems
              in <em>two or more</em> major life corners?
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
                Yep
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
                Nope
              </button>
            </div>
          </div>
          <div className="question-block">
            <label className="prompt">
              <strong>Kid era:</strong> did similar mess show up in{" "}
              <em>two or more</em> important places (school, family, friends,
              hobbies, confidence)?
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
                Yep
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
                Nope
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 7 && (
        <section>
          <h2 className="section-title">Could something else be the main character?</h2>
          <p className="section-hint">
            Super rough gut check: sometimes depression, anxiety, bipolar, sleep,
            substances, etc. can look like ADHD. Clinicians sort that out properly;
            we’re just asking what <em>you</em> think from the inside.
          </p>
          <div className="question-block">
            <label className="prompt">
              Does it feel like <strong>another</strong> mental health thing
              explains your struggles way better than ADHD vibes would?
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
                Yeah, mostly
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
                Nah / not sure
              </button>
            </div>
          </div>
        </section>
      )}

      {showResults && (
        <section>
          <div className="results-hero">
            <h2>Your lil recap</h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>
              Numbers for fun + self-understanding — a pro still owns the actual
              diagnosis chat.
            </p>
            {onset.lifelongPattern === true && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                Timeline: you said this feels <strong>pretty lifelong</strong>,
                with signs hanging around before age 7.
              </p>
            )}
            {onset.lifelongPattern === false && (
              <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                Timeline: you said it might <strong>not</strong> be a neat
                “since tiny kid” story before age 7.
                {onset.onsetAgeNote.trim() ? (
                  <>
                    {" "}
                    You wrote: <em>{onset.onsetAgeNote.trim()}</em>
                  </>
                ) : null}{" "}
                Totally normal — clinicians dig into this more gently in person.
              </p>
            )}
          </div>

          <div className="results-grid two" style={{ marginBottom: "1rem" }}>
            <div className="stat-card">
              <h3>Focus stuff — kid era</h3>
              <div className="big">
                {summary.inattChild} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Kid-era cutoff on the form: ≥{THRESHOLD_CHILD} in a domain
              </p>
            </div>
            <div className="stat-card">
              <h3>Focus stuff — grown-up era</h3>
              <div className="big">
                {summary.inattAdult} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Paper form says ≥{THRESHOLD_ADULT_FORM}; some studies use ≥
                {THRESHOLD_ADULT_RESEARCH}
              </p>
            </div>
            <div className="stat-card">
              <h3>Buzzy / impulsive — kid era</h3>
              <div className="big">
                {summary.hiChild} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Kid-era cutoff: ≥{THRESHOLD_CHILD}
              </p>
            </div>
            <div className="stat-card">
              <h3>Buzzy / impulsive — grown-up era</h3>
              <div className="big">
                {summary.hiAdult} / 9
              </div>
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                Form: ≥{THRESHOLD_ADULT_FORM} · softer research bar: ≥
                {THRESHOLD_ADULT_RESEARCH}
              </p>
            </div>
          </div>

          <div className="stat-card" style={{ marginBottom: "1rem" }}>
            <h3>You vs other people (what you tapped)</h3>
            <ul className="checklist">
              <li>
                <span className="mark ok">•</span>
                <span>
                  Focus vs others — grown-up:{" "}
                  {moreInattAdult === null
                    ? "—"
                    : moreInattAdult
                      ? "more / more often"
                      : "not more"}
                  ; kid:{" "}
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
                  Buzzy side vs others — grown-up:{" "}
                  {moreHiAdult === null
                    ? "—"
                    : moreHiAdult
                      ? "more / more often"
                      : "not more"}
                  ; kid:{" "}
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
            <h3>Grown-up “flavour” from symptom counts</h3>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>
              Strict-ish form cutoff (≥{THRESHOLD_ADULT_FORM} per domain):{" "}
              <strong>{subtypeLabel(summary.subtypeAdultForm)}</strong>
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--muted)" }}>
              Softer research-style cutoff (≥{THRESHOLD_ADULT_RESEARCH}):{" "}
              <strong>{subtypeLabel(summary.subtypeAdultResearch)}</strong>
            </p>
          </div>

          <div className="stat-card">
            <h3>Big-picture checklist</h3>
            <ul className="checklist">
              <li>
                <span className={`mark ${summary.childMeetsA ? "ok" : "bad"}`}>
                  {markChar(summary.childMeetsA)}
                </span>
                <span>
                  Kid era: six+ on the focus list and/or six+ on the buzzy list
                  (you: focus {summary.inattChild}, buzzy {summary.hiChild})
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
                  Grown-up era (form threshold): six+ in at least one domain
                  (focus {summary.inattAdult}, buzzy {summary.hiAdult})
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
                  Grown-up era (research-y threshold ≥{THRESHOLD_ADULT_RESEARCH},
                  FYI only)
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
                <span>Grown-up: rough patches in ≥2 big life areas</span>
              </li>
              <li>
                <span
                  className={`mark ${
                    summary.childImpairmentTwoDomains === true ? "ok" : "bad"
                  }`}
                >
                  {markChar(summary.childImpairmentTwoDomains)}
                </span>
                <span>Kid era: rough patches in ≥2 big life areas</span>
              </li>
              <li>
                <span className={`mark ${markClass(summary.criterionEOk)}`}>
                  {markChar(summary.criterionEOk)}
                </span>
                <span>
                  You didn’t say another condition is the <em>main</em> explanation
                  (you picked <em>Nah / not sure</em>) — ✓ = that’s consistent with
                  the usual scoring-sheet friendly answer
                </span>
              </li>
            </ul>
          </div>

          <div className="disclaimer" style={{ marginTop: "1.5rem" }}>
            <p style={{ marginTop: 0 }}>
              If a bunch of this resonated, chatting with someone who knows adult
              ADHD can feel really validating. If you’re in crisis, please reach
              for local emergency help or a crisis line — you matter.
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
              Clear & start fresh
            </button>
          </div>
        </section>
      )}

      {!showResults && (
        <div className="actions">
          {step > 0 && (
            <button type="button" className="secondary" onClick={back}>
              Oops, back
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={next}
            disabled={!canAdvance()}
          >
            {step === 0 ? "Let’s go" : "Next"}
          </button>
        </div>
      )}

      {!showResults && step > 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "1rem" }}>
          {!canAdvance() &&
            "Tap everything on this page first — then we can roll on."}
        </p>
      )}
    </div>
  );
}
