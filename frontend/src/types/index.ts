export interface AdminDashboardProps {
 surveys: any[];
 setSurveys: (surveys: any[]) => void;
 responses: any[];
}

export interface UserDashboardProps {
 surveys: any[];
 responses: any[];
 submitResponse: (surveyId: number, answer: string) => void;
 userResponses: Record<string, string>;
}

export interface Survey {
  id: number | string;
  title: string;
  description: string;
  dueDate: string;
  questions: Array<{
    id: number;
    type: string;
    question: string;
    options?: string[];
    required: boolean;
  }>;
}


export type SurveyQuestion = {
  id?: number;
  type: "text" | "multiple-choice" | "checkbox" | "rating";
  question: string;
  options?: string[];
  required: boolean;
}

export interface NewSurvey {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  status: "draft" | "preview" | "published";
}

