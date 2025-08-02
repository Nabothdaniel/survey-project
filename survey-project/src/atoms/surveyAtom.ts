import { atom } from "jotai";

export type SurveyStatus = "new" | "in_progress" | "completed";

import type { Survey } from "../types";

export interface UserSurveyState {
  [surveyId: number | string]: {
    status: SurveyStatus;
    answers: { [questionId: number]: string };
  };
}

// Fake surveys
export const surveyData: Survey[] = [
  {
    id: 1,
    title: "Employee Satisfaction Survey",
    description: "Help us improve your workplace experience by sharing your feedback.",
    dueDate: "2025-08-15",
    questions: [
      { id: 1, type: "rating", question: "How satisfied are you with your work environment?", required: true },
      { id: 2, type: "text", question: "What do you enjoy most about working here?", required: false },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which benefit do you value most?",
        options: ["Health Insurance", "Work From Home", "Learning Programs", "Team Events"],
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: "Product Feedback Survey",
    description: "Share your thoughts on our latest product features.",
    dueDate: "2025-08-20",
    questions: [
      { id: 1, type: "text", question: "What new feature would you like us to build?", required: true },
    ],
  },
];

// Atom for user survey state
export const userSurveysAtom = atom<UserSurveyState>({});