import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useSurveyStats } from "../../../hooks/useSurveyStats";
import { useSetAtom } from "jotai";
import { fetchSurveysAtom } from "../../../atoms/surveyAtom";

type SurveyStatus = "new" | "in_progress" | "completed";

const SurveyPage: React.FC = () => {
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    surveyData,
    surveyStatusMap,
    setSurveyStatusMap,
    getStatus,
  } = useSurveyStats();

  const fetchSurveys = useSetAtom(fetchSurveysAtom);

  useEffect(() => {
    if (surveyData.length === 0) {
      fetchSurveys();
    }
  }, [fetchSurveys, surveyData]);

  const survey = surveyData.find((s) => s.id === selectedSurveyId);
  let currentAnswers: Record<string, string> = {};

if (survey?.id !== undefined) {
  const key = survey.id.toString();
  currentAnswers = surveyStatusMap[key]?.answers || {};
}


  const handleChange = (questionId: number, value: string) => {
    if (!survey) return;
    const idStr = survey.id.toString();
    setSurveyStatusMap((prev) => ({
      ...prev,
      [idStr]: {
        status: "in_progress",
        answers: {
          ...prev[idStr]?.answers,
          [questionId]: value,
        },
      },
    }));
  };

  const handleSubmit = () => {
    if (!survey) return;
    const idStr = survey.id.toString();

    const unansweredRequired = survey.questions.filter(
      (q) => q.required && !currentAnswers[q.id]
    );

    if (unansweredRequired.length > 0) {
      alert("Please answer all required questions.");
      return;
    }

    setSurveyStatusMap((prev) => ({
      ...prev,
      [idStr]: {
        status: "completed",
        answers: currentAnswers,
      },
    }));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex flex-col items-center justify-center text-center">
        <FiCheckCircle className="text-green-600 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Thank you for completing the survey!
        </h2>
        <button
          onClick={() => {
            setSelectedSurveyId(null);
            setSubmitted(false);
          }}
          className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Back to Surveys
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      {!survey ? (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Surveys
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {surveyData.map((s) => {
              const state: SurveyStatus = getStatus(s.id);
              return (
                <div
                  key={s.id}
                  className="p-4 sm:p-6 flex justify-between items-start hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Due: {s.dueDate}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSurveyId(Number(s.id));
                      setSubmitted(false);
                    }}
                    disabled={state === "completed"}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      state === "new"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : state === "in_progress"
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {state === "new" && "Start Survey"}
                    {state === "in_progress" && "Continue"}
                    {state === "completed" && "Completed"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            <p className="text-gray-600 mt-2">{survey.description}</p>
            <p className="text-sm text-gray-500 mt-2">Due: {survey.dueDate}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            {survey.questions.map((q) => (
              <div
                key={q.id}
                className="bg-white p-5 rounded-lg shadow border border-gray-200"
              >
                <label className="block text-gray-800 font-medium mb-3">
                  {q.question}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {q.type === "text" && (
                  <textarea
                    className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-0 border"
                    rows={4}
                    value={currentAnswers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                )}

                {q.type === "multiple-choice" && (
                  <div className="space-y-2">
                    {q.options?.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt}
                          checked={currentAnswers[q.id] === opt}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === "rating" && (
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex flex-col items-center">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={num}
                          checked={currentAnswers[q.id] === String(num)}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm mt-1">{num}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setSelectedSurveyId(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Submit Survey
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SurveyPage;
