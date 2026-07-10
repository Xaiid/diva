import { translations } from "./divaContent";

export type CriterionItem = {
  id: string;
  code: string;
  title: string;
  adultExamples: string[];
  childExamples: string[];
};

export type Translations =  typeof translations.en;
