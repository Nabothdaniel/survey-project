import { surveyData, userSurveysAtom } from "../../../atoms/surveyAtom";
import { useAtom } from "jotai";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#3B82F6", "#FACC15", "#22C55E", "#EF4444"];

const Outcomes = () => {
  const [userSurveys] = useAtom(userSurveysAtom);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Survey Outcomes</h1>

      <div className="space-y-6">
        {surveyData.map((s) => {
          const userSurvey = userSurveys[s.id];
          return (
            <div key={s.id} className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
              <p className="text-gray-600">{s.description}</p>

              {!userSurvey || userSurvey.status !== "completed" ? (
                <p className="text-sm text-gray-500 mt-3">No responses yet.</p>
              ) : (
                <div className="mt-4 space-y-6">
                  {s.questions.map((q) => {
                    const answer = userSurvey.answers[q.id];
                    return (
                      <div key={q.id}>
                        <p className="font-medium text-gray-700 mb-2">{q.question}</p>

                        {/* Show text response */}
                        {q.type === "text" && (
                          <p className="text-gray-600 bg-gray-50 p-2 rounded">{answer || "Not answered"}</p>
                        )}

                        {/* Show chart for multiple-choice */}
                        {q.type === "multiple-choice" && answer && (
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={q.options?.map((opt) => ({
                                  name: opt,
                                  value: answer === opt ? 1 : 0,
                                }))}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                                dataKey="value"
                              >
                                {q.options?.map((_, i) => (
                                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        )}

                        {/* Show chart for ratings */}
                        {q.type === "rating" && answer && (
                          <div className="text-lg font-semibold text-blue-600">
                            Rating: {answer} / 5 ⭐
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Outcomes;
