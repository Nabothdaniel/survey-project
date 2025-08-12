// src/components/Outcomes.tsx
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { surveyAtom, fetchSurveysAtom } from "../../../atoms/surveyAtom";
import { surveyOutcomesAtom, fetchSurveyOutcomesAtom } from "../../../atoms/surveyOutcomesAtom";
import type { SurveyOutcome } from "../../../types";

const Outcomes: React.FC = () => {
  const [surveys] = useAtom(surveyAtom);
  const [, fetchSurveys] = useAtom(fetchSurveysAtom);

  const [outcomes] = useAtom(surveyOutcomesAtom);
  const [, fetchOutcomes] = useAtom(fetchSurveyOutcomesAtom);

  const [selectedSurveyId, setSelectedSurveyId] = useState<string | number | null>(null);


  // Fetch surveys when component mounts
  useEffect(() => {
    fetchSurveys({});
  }, []);

  // Fetch outcomes when a survey is selected
  useEffect(() => {
    if (selectedSurveyId) {
      fetchOutcomes({
        surveyId:selectedSurveyId,
        onDone: (data) => console.log("Fetched outcomes:", data),
        onError: () => console.error("Failed to fetch outcomes")
      });

    }
  }, [selectedSurveyId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const selectedSurvey = selectedSurveyId
    ? surveys.find(s => s.id === selectedSurveyId)
    : null;

  // Calculate percentages for a field
  const calculatePercentages = (field: string) => {
    const total = outcomes.length;
    const counts: Record<string, number> = {};

    outcomes.forEach((res: SurveyOutcome) => {
      const val = res.data[field];
      if (val) {
        counts[val] = (counts[val] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([option, count]) => ({
      option,
      count,
      percentage: total ? ((count / total) * 100).toFixed(1) : "0",
    }));
  };

  const calculateAverageRating = () => {
    const ratings = outcomes
      .map((r: SurveyOutcome) => {
        const match = r.data["Rating"]?.match(/\d/);
        return match ? parseInt(match[0]) : null;
      })
      .filter(Boolean) as number[];

    if (!ratings.length) return null;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="md:max-w-7xl mx-auto  py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms & Outcomes</h1>
            <p className="text-gray-600 mt-2">
              Manage your forms and analyze responses
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Forms
                </h2>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{surveys.length} forms total</span>
                  <span>{surveys.filter(f => f.status === "Live").length} active</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {surveys.map(form => (
                  <div
                    key={form.id}
                    onClick={() => setSelectedSurveyId(form.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedSurveyId === form.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">
                        {form.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          String(form.status)
                        )}`}
                      >
                        {form.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {form.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{form.totalResponses || 0} responses</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Details */}
          <div className="lg:col-span-2">
            {selectedSurvey ? (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {selectedSurvey.title}
                        </h2>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                            String(selectedSurvey.status)
                          )}`}
                        >
                          {selectedSurvey.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        {selectedSurvey.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedSurvey.totalResponses || 0}
                      </div>
                      <div className="text-sm text-gray-500">Total Responses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedSurvey.fields?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Form Fields</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {outcomes.length}
                      </div>
                      <div className="text-sm text-gray-500">Analyzed</div>
                    </div>
                  </div>
                </div>

                {/* Outcomes by Percentage */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                  {selectedSurvey.fields?.map((field: string) => {
                    const percentages = calculatePercentages(field);
                    return (
                      <div key={field} className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-2">{field}</h4>

                        {field === "Rating" && (
                          <p className="text-blue-600 mb-3">
                            Average Rating: {calculateAverageRating() || "N/A"} ⭐
                          </p>
                        )}

                        {field === "Comments" ? (
                          <div className="space-y-2">
                            {outcomes.slice(0, 3).map(res => (
                              <p
                                key={res.id}
                                className="p-3 bg-gray-50 rounded text-gray-700 text-sm"
                              >
                                {res.data["Comments"]}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {percentages.map((p, i) => (
                              <div key={i}>
                                <div className="flex justify-between text-sm">
                                  <span>{p.option}</span>
                                  <span>
                                     ({p.percentage}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded"
                                    style={{ width: `${p.percentage}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a Form
                </h3>
                <p className="text-gray-500">
                  Choose a form from the list to view its details and summary outcomes.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Outcomes;
