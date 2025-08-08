// src/atoms/surveyStatusAtom.ts
import { atom } from "jotai";

type SurveyStatusMap = {
   [surveyId: string]: {
    status: "new" | "in_progress" | "completed";
    answers?: Record<string, string>; 
  };
};

export const surveyStatusAtom = atom<SurveyStatusMap>({});
