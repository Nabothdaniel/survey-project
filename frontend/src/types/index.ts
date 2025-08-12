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
    text: string;
    options?: string[];
    required: boolean;
  }>;
  status?:string;
   totalResponses?: number;
  fields?: string[];
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

export type SurveyStatusMap = {
   [surveyId: string]: {
    status: "new" | "in_progress" | "completed";
    answers?: Record<string, string>; 
  };
};


export type SurveyOutcome = {
  id: number;
  surveyId: number;
  data: Record<string, string>;
};

export interface TableRow {
  User: string | number;
  Question: string;
  Answer: string;
  Status: string;
}



