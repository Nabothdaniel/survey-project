// src/atoms/surveyOutcomesAtom.ts
import { atom } from "jotai";
import api from "../utils/api";
import type { SurveyOutcome, Survey } from "../types";
import { surveyAtom } from "./surveyAtom";

export const surveyOutcomesAtom = atom<SurveyOutcome[]>([]);

export const fetchSurveyOutcomesAtom = atom(
  null,
  async (get, set, { surveyId, onDone, onError }: { 
    surveyId: number | string; 
    onDone?: (outcomes: SurveyOutcome[]) => void; 
    onError?: () => void; 
  }) => {
    try {
      const res = await api.get(`/admin/get-survey-outcomes/${surveyId}`);

      // Calculate total responses from all question outcomes
      const totalResponses = res.data.questions.reduce(
        (acc: number, q: any) => acc + q.outcomes.length,
        0
      );

      // Extract all question texts
      const fields = res.data.questions.map((q: any) => q.text);

      // Transform into SurveyOutcome[]
      const transformed: SurveyOutcome[] = res.data.questions.flatMap((q: any) =>
        q.outcomes.map((o: any, oIdx: number) => ({
          id: `${q.id}-${oIdx}`,
          data: { [q.text]: o.answer }
        }))
      );

      // Store outcomes
      set(surveyOutcomesAtom, transformed);

      // Merge extra info into surveyAtom so UI can display it
      const surveys = get(surveyAtom);
      const updatedSurveys = surveys.map((s: Survey) =>
        s.id === surveyId
          ? { ...s, totalResponses, fields }
          : s
      );
      set(surveyAtom, updatedSurveys);

      if (onDone) onDone(transformed);
    } catch (err) {
      console.error("Failed to fetch survey outcomes", err);
      if (onError) onError();
    }
  }
);
