import { useLang } from "../../context/LanguageContext";
import { INATTENTION, HYPERACTIVITY_IMPULSIVITY, INATTENTION_ES, HYPERACTIVITY_IMPULSIVITY_ES } from "./DivaContent";
import { LangNav } from "../../components/LangNav";
import {
  PeerQuestions,
  SymptomStep,
  WelcomeStep,
  OnsetStep,
  ImpairmentStep,
  CriterionEStep,
  ResultsSection,
  StepActions,
} from "./components";
import { useDivaState } from "./hooks/useDivaState";
import "../../App.css";

const TOTAL_STEPS = 9;

function Diva() {
  const { lang, t } = useLang();
  const {
    step,
    inatt,
    hi,
    moreInattAdult,
    moreInattChild,
    moreHiAdult,
    moreHiChild,
    onset,
    impairment,
    criterionE,
    summary,
    setPhase,
    setStep,
    setInatt,
    setHi,
    setMoreInattAdult,
    setMoreInattChild,
    setMoreHiAdult,
    setMoreHiChild,
    setOnset,
    setImpairment,
    setCriterionE,
    canAdvance,
    next,
    back,
  } = useDivaState();

  const inattItems = lang === "es" ? INATTENTION_ES : INATTENTION;
  const hiItems = lang === "es" ? HYPERACTIVITY_IMPULSIVITY_ES : HYPERACTIVITY_IMPULSIVITY;
  const showResults = step === TOTAL_STEPS - 1;

  return (
    <div className="app">
      <LangNav />

      <WelcomeStep step={step} />

      {step === 1 && (
        <SymptomStep
          title={t.inattentionStep.title}
          hint={t.inattentionStep.hint}
          items={inattItems}
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
          title={t.hiStep.title}
          hint={t.hiStep.hint}
          items={hiItems}
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
        <OnsetStep onset={onset} setOnset={setOnset} />
      )}

      {step === 6 && (
        <ImpairmentStep impairment={impairment} setImpairment={setImpairment} />
      )}

      {step === 7 && (
        <CriterionEStep criterionE={criterionE} setCriterionE={setCriterionE} />
      )}

      {showResults && (
        <ResultsSection
          summary={summary}
          onset={onset}
          moreInattAdult={moreInattAdult}
          moreInattChild={moreInattChild}
          moreHiAdult={moreHiAdult}
          moreHiChild={moreHiChild}
          setOnset={setOnset}
          setStep={setStep}
          setInatt={setInatt}
          setHi={setHi}
          setMoreInattAdult={setMoreInattAdult}
          setMoreInattChild={setMoreInattChild}
          setMoreHiAdult={setMoreHiAdult}
          setMoreHiChild={setMoreHiChild}
          setImpairment={setImpairment}
          setCriterionE={setCriterionE}
        />
      )}

      {!showResults && (
        <StepActions
          step={step}
          back={back}
          next={() => next(TOTAL_STEPS, inattItems, hiItems)}
          canAdvance={() => canAdvance(inattItems, hiItems)}
          showResults={showResults}
        />
      )}
    </div>
  );
}

export { Diva };
