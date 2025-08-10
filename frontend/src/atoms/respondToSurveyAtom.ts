// atoms/respondToSurveyAtom.ts
import { atom } from "jotai";
import api from "../utils/api";

export const respondToSurveyAtom = atom(null);

export interface SurveyResponsePayload {
  surveyId: string | number;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export const submitSurveyResponseAtom = atom(
  null,
  async (_get, _set, responsePayload: SurveyResponsePayload) => {
    try {
      return await api.post("/response/respond", responsePayload);
    } catch (error: unknown) {
      const err = error as { response?: { data?: any }; message?: string };
      console.error("Failed to submit survey:", err);

      throw err.response?.data || err.message || "Unknown error";
    }
  }
);
