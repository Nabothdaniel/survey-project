// src/atoms/surveyAtom.ts
import { atom } from "jotai";
import api from "../utils/api"; 
import type { Survey } from "../types"; 

export const surveyAtom = atom<Survey[]>([]);

// Write-only atom to fetch surveys from API and update the atom
export const fetchSurveysAtom = atom(
  null,
  async (_get, set, update: { onDone?: () => void; onError?: () => void }) => {
    try {
      const response = await api.get("/auth/surveys"); 
      const surveys = response.data.surveys || response.data;
      set(surveyAtom, surveys);
      update?.onDone?.(); // ✅ call callback on success
    } catch (error) {
      console.error("Error fetching surveys:", error);
      set(surveyAtom, []); 
      update?.onError?.(); // ✅ call callback on error
    }
  }
);
