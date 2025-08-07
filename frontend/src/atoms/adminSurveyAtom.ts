import { atom } from "jotai"
import api from "../utils/api"
import type { SurveyQuestion,NewSurvey } from "../types"

export interface Survey {
  id?: string
  formTitle: string
  formDescription: string
  questions: SurveyQuestion[]
  status: "draft" | "preview" | "published"
}

// Active survey being edited
export const surveyAtom = atom<Survey>({
  id: "",
  formTitle: "",
  formDescription: "",
  questions: [],
  status: "draft",
})

/* ----------------- DRAFTS (Local Only) ----------------- */

// Load drafts from localStorage initially
const storedDrafts: Survey[] = JSON.parse(localStorage.getItem("surveyDrafts") || "[]")

export const draftsAtom = atom<Survey[]>(storedDrafts)

// Save draft
export const saveDraftAtom = atom(
  null,
  (get, set, draft: Survey) => {
    const updatedDrafts = [...get(draftsAtom).filter(d => d.id !== draft.id), draft]
    localStorage.setItem("surveyDrafts", JSON.stringify(updatedDrafts))
    set(draftsAtom, updatedDrafts)
  }
)

// Delete draft
export const deleteDraftAtom = atom(
  null,
  (get, set, draftId: string) => {
    const updatedDrafts = get(draftsAtom).filter(d => d.id !== draftId)
    localStorage.setItem("surveyDrafts", JSON.stringify(updatedDrafts))
    set(draftsAtom, updatedDrafts)
  }
)

/* ----------------- PUBLISHED SURVEYS (Backend) ----------------- */

export const surveysAtom = atom<NewSurvey[]>([])

// Fetch from backend
export const fetchSurveysAtom = atom(
  null,
  async (_get, set) => {
    const { data } = await api.get("/surveys")
    set(surveysAtom, data.surveys || [])
  }
)
