import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState,useMemo } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import { useSurveyStats } from "../../../hooks/useSurveyStats";
import { useSetAtom } from "jotai";
import { submitSurveyResponseAtom } from "../../../atoms/respondToSurveyAtom"; 
import {Spinner} from '../../../components/ui/spinner'
import {toast} from 'react-toastify'


const TakeSurvey = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const submitSurveyResponse = useSetAtom(submitSurveyResponseAtom);


    const {
        surveyData,
        surveyStatusMap,
        setSurveyStatusMap,
    } = useSurveyStats();

    const survey = surveyData.find((s) => s.id === String(id));


    const savedStatus = survey ? surveyStatusMap[survey.id.toString()] : undefined;

const savedAnswers = useMemo(() => {
  return savedStatus?.answers || {};
}, [savedStatus]);

    const [answers, setAnswers] = useState<{ [key: number]: string }>(savedAnswers);
    const [submitted, setSubmitted] = useState(savedStatus?.status === "completed");

    // On mount, sync saved answers if any
    useEffect(() => {
        if (savedAnswers && JSON.stringify(savedAnswers) !== JSON.stringify(answers)) {
            setAnswers(savedAnswers);
        }
    }, [savedAnswers,answers]);

   



   if (!surveyData.length) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <p className="text-gray-600 font-medium">Loading survey...</p>
        </div>
    );
}

if (!survey) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <p className="text-red-600 font-semibold">Survey not found.</p>
        </div>
    );
}

    const handleChange = (questionId: number, value: string) => {
        const updatedAnswers = { ...answers, [questionId]: value };
        setAnswers(updatedAnswers);

        setSurveyStatusMap((prev) => ({
            ...prev,
            [survey.id.toString()]: {
                status: submitted ? "completed" : "in_progress",
                answers: updatedAnswers,
            },
        }));
    };


const handleSubmit = async () => {

  const missing = survey.questions.filter(
    (q) => q.required && !answers[q.id]
  );

  if (missing.length > 0) {
    toast.error("Please answer all required questions.");
    return;
  }

  const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
    questionId,
    answer,
  }));

  const payload = {
    surveyId: survey.id,
    answers: formattedAnswers,
  };

  try {
    setLoading(true);
    await submitSurveyResponse(payload);

    setSurveyStatusMap((prev) => ({
      ...prev,
      [survey.id.toString()]: {
        status: "completed",
        answers,
      },
    }));

    setSubmitted(true);
    toast.success("Survey submitted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit the survey. Please try again.");
  } finally {
    setLoading(false);
  }
};

    if (submitted) {
        return (
            <div className="max-w-6xl mx-auto mt-20 p-6 flex flex-col items-center justify-center text-center">
                <FiCheckCircle className="text-green-600 text-5xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">
                    Thank you for completing the survey!
                </h2>
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
            >
                <FiArrowLeft className="mr-2" /> Back
            </button>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
                <p className="text-gray-600 mt-2">{survey.description}</p>
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
                            {q.text}
                            {q.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {q.type === "text" && (
                            <textarea
                                className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-0 border-0"
                                placeholder ="type answer ...."
                                rows={4}
                                value={answers[q.id] || ""}
                                onChange={(e) => handleChange(q.id, e.target.value)}
                            />
                        )}

{q.type === "multiple-choice" && (
  <div className="space-y-2">
    {(Array.isArray(q.options)
  ? q.options
  : typeof q.options === "string"
  ? JSON.parse(q.options)
  : [])
.map((opt) => (
      <label key={opt} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={`q-${q.id}`}
          value={opt}
          checked={answers[q.id] === opt}
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
                                            checked={answers[q.id] === String(num)}
                                            onChange={(e) => handleChange(q.id, e.target.value)}
                                            className="text-blue-600 focus:ring-blue-500 outline-none border-gray-200 rounded-full w-8 h-8 cursor-pointer"
                                        />
                                        <span className="text-sm mt-1">{num}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button
                  disabled={loading}
                    type="submit"
                     onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center justify-center items-center rounded-lg font-medium"
                >
                    {loading ? <Spinner/> : 'Submit Survey'}
                </button>
            </form>
        </div>
    );
};

export default TakeSurvey;
