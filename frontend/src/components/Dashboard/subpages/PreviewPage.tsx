import { useAtom } from "jotai";
import { surveyAtom } from "../../../atoms/adminSurveyAtom";
import { FiCheckSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { SurveyQuestion } from "../../../types";

const PreviewPage = () => {
  const [survey] = useAtom(surveyAtom);
  const navigate = useNavigate();

  if (!survey.formTitle) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-gray-600">No survey data found.</p>
        <button
          onClick={() => navigate("/admin")}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create a Survey
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8 mt-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {survey.formTitle}
      </h1>
      <p className="text-gray-600 mb-6">{survey.formDescription}</p>

      <form className="space-y-6">
        {survey.questions.map((q: SurveyQuestion, index: number) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <label className="block font-medium text-gray-900 mb-2">
              {index + 1}. {q.question}
              {q.required && <span className="text-red-500">*</span>}
            </label>

            {q.type === "text" && (
              <input
                type="text"
                placeholder="Your answer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            )}

            {q.type === "multiple-choice" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt: string, idx: number) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="radio" name={`q${q.id}`} /> {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "checkbox" && q.options && (
              <div className="space-y-2">
                {q.options.map((opt: string, idx: number) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="checkbox" /> {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "rating" && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </form>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => navigate("/admin")}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={() => navigate(`/admin`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FiCheckSquare /> Submit Survey
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
