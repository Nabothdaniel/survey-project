import { useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { surveyAtom, draftsAtom } from "../../atoms/adminSurveyAtom";
import type { SurveyQuestion } from "../../types";
import { nanoid } from "nanoid";
import Alert from "../ui/Alert";

import {
  FiEdit,
  FiPlus,
  FiList,
  FiCheckSquare,
  FiStar,
  FiTrash2,
  FiMinus,
  FiHelpCircle,
  FiEye,
} from "react-icons/fi";

const FormSection = () => {
  const [survey, setSurvey] = useAtom(surveyAtom);
  const [drafts, setDrafts] = useAtom(draftsAtom);
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info", message: string } | null>(null);
  const [questionCounter, setQuestionCounter] = useState(
    survey.questions.length + 1
  );

  const navigate = useNavigate();

  const addQuestion = (type: SurveyQuestion["type"]) => {
    const newQuestion: SurveyQuestion = {
      id: questionCounter,
      type,
      question: "",
      options:
        type === "multiple-choice" || type === "checkbox" ? [""] : undefined,
      required: false,
    };

    setSurvey({
      ...survey,
      questions: [...survey.questions, newQuestion],
    });
    setQuestionCounter(questionCounter + 1);
  };

  const updateQuestion = (id: number, field: keyof SurveyQuestion, value: number | string | boolean) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    });
  };

  const removeQuestion = (id: number) => {
    setSurvey({
      ...survey,
      questions: survey.questions.filter((q) => q.id !== id),
    });
  };

  const addOption = (questionId: number) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === questionId && q.options
          ? { ...q, options: [...q.options, ""] }
          : q
      ),
    });
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === questionId && q.options
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
          : q
      ),
    });
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setSurvey({
      ...survey,
      questions: survey.questions.map((q) =>
        q.id === questionId && q.options
          ? {
            ...q,
            options: q.options.filter((_, idx) => idx !== optionIndex),
          }
          : q
      ),
    });
  };

  type defaultSurveyType = {
    id: string;
    formTitle: string;
    formDescription: string;
    questions: any[];
    status: "draft" | "preview" | "published";
  }


  const defaultSurvey: defaultSurveyType = {
    id: "",
    formTitle: "",
    formDescription: "",
    questions: [],
    status: "draft",
  };


  const handleSaveDraft = () => {
    if (!survey.formTitle.trim() && !survey.formDescription.trim() && survey.questions.length === 0) {
      setAlert({ type: "error", message: "Cannot save. Your form is empty." });
      return;
    }

    const draftId = survey.id || nanoid(6);
    const updatedDrafts = drafts.filter((d) => d.id !== draftId);
    setDrafts([...updatedDrafts, { ...survey, id: draftId, status: "draft" }]);

    setSurvey(defaultSurvey);

    setAlert({ type: "success", message: "Draft saved! Your form has been cleared." });
  };



  const handlePreview = () => {
    setSurvey({ ...survey, status: "preview" });
    navigate("/admin/preview");
  };

  const handlePublish = () => {
    setSurvey({ ...survey, status: "published" });
    setAlert({ type: "success", message: "Survey created! redirecting...." });
    setTimeout(() => { navigate("/admin/forms-and-outcomes"); }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          duration={4000} // auto close after 4s
        />
      )}
      {/* Form Basic Info */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <FiEdit className="text-blue-600 text-lg" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Create New Survey
          </h2>
          <p className="text-gray-600">Build your custom survey form</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey Title
          </label>
          <input
            type="text"
            value={survey.formTitle}
            onChange={(e) =>
              setSurvey({ ...survey, formTitle: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter survey title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={survey.formDescription}
            onChange={(e) =>
              setSurvey({ ...survey, formDescription: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter survey description..."
          />
        </div>
      </div>

      {/* Questions Section */}
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Survey Questions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addQuestion("text")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-1"
            >
              <FiPlus /> Text
            </button>
            <button
              onClick={() => addQuestion("multiple-choice")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-1"
            >
              <FiList /> Multiple Choice
            </button>
            <button
              onClick={() => addQuestion("checkbox")}
              className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-1"
            >
              <FiCheckSquare /> Checkbox
            </button>
            <button
              onClick={() => addQuestion("rating")}
              className="bg-blue-300 hover:bg-blue-400 text-white px-3 py-2 text-sm rounded-lg flex items-center gap-1"
            >
              <FiStar /> Rating
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {survey.questions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiHelpCircle className="mx-auto text-4xl mb-4" />
              <p>No questions added yet. Click the buttons above to add questions.</p>
            </div>
          ) : (
            survey.questions.map((question: any, index: number) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      Q{index + 1}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      {question.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(question.id, "question", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter your question..."
                />

                {(question.type === "multiple-choice" ||
                  question.type === "checkbox") &&
                  question.options && (
                    <div className="space-y-2">
                      {question.options.map((option: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOption(question.id, idx, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${idx + 1}`}
                          />
                          {question.options.length > 1 && (
                            <button
                              onClick={() => removeOption(question.id, idx)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiMinus />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(question.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <FiPlus /> Add Option
                      </button>
                    </div>
                  )}

                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) =>
                      updateQuestion(question.id, "required", e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Required question
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveDraft}
          className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Save as Draft
        </button>
        <button
          onClick={handlePreview}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
        >
          <FiEye /> Preview Survey
        </button>
        <button
          onClick={handlePublish}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2"
        >
          <FiStar /> Publish Survey
        </button>
      </div>
    </div>
  );
};

export default FormSection;
