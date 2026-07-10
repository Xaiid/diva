import { useState, type Dispatch, type SetStateAction, useMemo } from "react";
import { CriterionItem } from "../Diva.types";
import { OnsetAnswers, PhaseAnswers, ImpairmentAnswers, CriterionEAnswers, buildSummary, countPresent } from "../DivaScoring";
import { INATTENTION, HYPERACTIVITY_IMPULSIVITY } from "../DivaContent";

export function emptyPhase(items: CriterionItem[]): PhaseAnswers {
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

export function useDivaState() {
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

    function canAdvance(inattItems: CriterionItem[], hiItems: CriterionItem[]): boolean {
        switch (step) {
            case 0:
                return true;
            case 1:
                return phaseComplete(inatt, inattItems);
            case 2:
                return moreInattAdult !== null && moreInattChild !== null;
            case 3:
                return phaseComplete(hi, hiItems);
            case 4:
                return moreHiAdult !== null && moreHiChild !== null;
            case 5:
                return onset.lifelongPattern !== null;
            case 6:
                return (
                    impairment.adultTwoOrMoreDomains !== null &&
                    impairment.childTwoOrMoreDomains !== null
                );
            case 7:
                return criterionE.betterExplainedByOtherDisorder !== null;
            default:
                return true;
        }
    }

    function next(totalSteps: number, inattItems: CriterionItem[], hiItems: CriterionItem[]) {
        if (!canAdvance(inattItems, hiItems)) return;
        setStep((s) => Math.min(s + 1, totalSteps - 1));
    }

    function back() {
        setStep((s) => Math.max(s - 1, 0));
    }

    return {
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
    };
}
