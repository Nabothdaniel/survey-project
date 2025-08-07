// in surveyAtoms.ts
import { atom } from "jotai"
import api from "../utils/api"
import type { NewSurvey } from "../types/index"
import { surveysAtom } from "./adminSurveyAtom"

export const createSurveyAtom = atom(
  null,
  async (get, set, survey: NewSurvey) => {
    try {
      const { data } = await api.post("/admin/create-survey", survey)
      // Update the list of published surveys
      set(surveysAtom, [...get(surveysAtom), data.survey])
      return data.survey
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to publish survey" }
    }
  }
)
