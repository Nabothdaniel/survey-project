import { atom } from "jotai"
import type { SurveyQuestion } from "../types"

export interface Survey {
  id: string
  formTitle: string
  formDescription: string
  questions: SurveyQuestion[]
  status: "draft" | "preview" | "published"
}

// Active form
export const surveyAtom = atom<Survey>({
  id: "",
  formTitle: "",
  formDescription: "",
  questions: [],
  status: "draft",
})

// Saved drafts list
export const draftsAtom = atom<Survey[]>([])
