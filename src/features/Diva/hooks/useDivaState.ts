import { useState, type Dispatch, type SetStateAction } from "react";
import { useMemo } from "react";
import { CriterionItem } from "../Diva.types";
import { OnsetAnswers, PhaseAnswers, ImpairmentAnswers, CriterionEAnswers, buildSummary, countPresent } from "../DivaScoring";
import { INATTENTION, HYPERACTIVITY_IMPULSIVITY, INATTENTION_ES, HYPERACTIVITY_IMPULSIVITY_ES } from "../divaContent";
import { translations } from "../divaContent";
import { Lang } from "../../../components/LangNav/LangNav.types";

export function useDivaState() {

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

    const [lang, setLang] = useState<Lang>("en");

    const inattItems = lang === "es" ? INATTENTION_ES : INATTENTION;
    const hiItems = lang === "es" ? HYPERACTIVITY_IMPULSIVITY_ES : HYPERACTIVITY_IMPULSIVITY;

    const STEPS = translations.en.steps;
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

    return {
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
        inattComplete,
        hiComplete,
        summary,
        emptyPhase,
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
    };
}