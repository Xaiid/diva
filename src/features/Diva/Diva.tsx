import {
  translations,
} from "./divaContent";
import { LangNav} from "../../components/LangNav";
import { PeerQuestions, 
  SymptomStep, 
  WelcomeStep, 
  OnsetStep,
  ImpairmentStep,
  CriterionEStep,
  ResultsSection,
  StepActions
 } from "./components";
 import { useDivaState } from "./hooks/useDivaState";
import "../../App.css";

function Diva() {
  const {
    lang,
    step,
    showResults,
    inatt,
    hi,
    inattItems,
    hiItems,
    moreInattAdult,
    moreInattChild,
    moreHiAdult,
    moreHiChild,
    onset,
    impairment,
    criterionE,
    summary,
    setPhase,
    setLang,
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

  const t = translations[lang];

  return (
    <div className="app">
      <LangNav lang={lang} onChange={setLang} />
      
      <WelcomeStep t={t} step={step} />

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
        <OnsetStep
          onset={onset}
          setOnset={setOnset}
          t={t}
        />
      )}

      {step === 6 && (
        <ImpairmentStep
          impairment={impairment}
          setImpairment={setImpairment}
          t={t}
        />
      )}

      {step === 7 && (
        <CriterionEStep
          criterionE={criterionE}
          setCriterionE={setCriterionE}
          t={t}
        />
      )}

      {showResults && (
        <ResultsSection
          t={t}
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
        next={next} 
        canAdvance={canAdvance} 
        showResults={showResults} t={t} />
      )}

    </div>
  );
}

export { Diva };

