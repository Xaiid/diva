export type PhaseAnswers = Record<
  string,
  { adult: boolean | null; child: boolean | null }
>;

export type OnsetAnswers = {
  lifelongPattern: boolean | null;
  /** If not lifelong, approximate age symptoms began (optional). */
  onsetAgeNote: string;
};

export type ImpairmentAnswers = {
  adultTwoOrMoreDomains: boolean | null;
  childTwoOrMoreDomains: boolean | null;
};

export type CriterionEAnswers = {
  /** If another disorder better explains symptoms, criterion E fails. */
  betterExplainedByOtherDisorder: boolean | null;
};

export const THRESHOLD_CHILD = 6;
export const THRESHOLD_ADULT_FORM = 6;
/** Research suggestion cited in DIVA materials for adults (informational only). */
export const THRESHOLD_ADULT_RESEARCH = 4;

export function countPresent(
  items: { id: string }[],
  answers: PhaseAnswers,
  phase: "adult" | "child"
): number {
  return items.filter((i) => answers[i.id]?.[phase] === true).length;
}

export type Subtype =
  | "combined"
  | "predominantly_inattentive"
  | "predominantly_hyperactive_impulsive"
  | "below_threshold";

export function adultSubtype(
  inattCount: number,
  hiCount: number,
  threshold: number
): Subtype {
  const inatt = inattCount >= threshold;
  const hi = hiCount >= threshold;
  if (inatt && hi) return "combined";
  if (inatt && !hi) return "predominantly_inattentive";
  if (!inatt && hi) return "predominantly_hyperactive_impulsive";
  return "below_threshold";
}

export function subtypeLabel(s: Subtype): string {
  switch (s) {
    case "combined":
      return "Combined presentation (inattention and hyperactivity/impulsivity)";
    case "predominantly_inattentive":
      return "Predominantly inattentive presentation";
    case "predominantly_hyperactive_impulsive":
      return "Predominantly hyperactive–impulsive presentation";
    default:
      return "Below typical symptom-count threshold for this period";
  }
}

export type ScoringSummary = {
  inattChild: number;
  inattAdult: number;
  hiChild: number;
  hiAdult: number;
  /** DSM-IV Criterion A: ≥6 inattention or ≥6 HI for that life phase (symptom count). */
  childMeetsA: boolean;
  adultMeetsAForm: boolean;
  adultMeetsAResearch: boolean;
  subtypeAdultForm: Subtype;
  subtypeAdultResearch: Subtype;
  onsetOk: boolean | null;
  adultImpairmentTwoDomains: boolean | null;
  childImpairmentTwoDomains: boolean | null;
  criterionEOk: boolean | null;
};

export function buildSummary(
  inattCountChild: number,
  inattCountAdult: number,
  hiCountChild: number,
  hiCountAdult: number,
  onset: OnsetAnswers,
  impairment: ImpairmentAnswers,
  criterionE: CriterionEAnswers
): ScoringSummary {
  const childMeetsA =
    inattCountChild >= THRESHOLD_CHILD || hiCountChild >= THRESHOLD_CHILD;
  const adultMeetsAForm =
    inattCountAdult >= THRESHOLD_ADULT_FORM ||
    hiCountAdult >= THRESHOLD_ADULT_FORM;
  const adultMeetsAResearch =
    inattCountAdult >= THRESHOLD_ADULT_RESEARCH ||
    hiCountAdult >= THRESHOLD_ADULT_RESEARCH;

  const onsetOk =
    onset.lifelongPattern === null
      ? null
      : onset.lifelongPattern === true
        ? true
        : false;

  const adultImpairmentTwoDomains = impairment.adultTwoOrMoreDomains;
  const childImpairmentTwoDomains = impairment.childTwoOrMoreDomains;

  const criterionEOk =
    criterionE.betterExplainedByOtherDisorder === null
      ? null
      : criterionE.betterExplainedByOtherDisorder === false;

  return {
    inattChild: inattCountChild,
    inattAdult: inattCountAdult,
    hiChild: hiCountChild,
    hiAdult: hiCountAdult,
    childMeetsA,
    adultMeetsAForm,
    adultMeetsAResearch,
    subtypeAdultForm: adultSubtype(
      inattCountAdult,
      hiCountAdult,
      THRESHOLD_ADULT_FORM
    ),
    subtypeAdultResearch: adultSubtype(
      inattCountAdult,
      hiCountAdult,
      THRESHOLD_ADULT_RESEARCH
    ),
    onsetOk,
    adultImpairmentTwoDomains,
    childImpairmentTwoDomains,
    criterionEOk,
  };
}
