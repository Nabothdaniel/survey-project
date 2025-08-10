/**
 * import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiBarChart2, FiDownload, FiPrinter } from "react-icons/fi";
import { motion } from "framer-motion";

const BLUE_COLORS = ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"];

const Reports = () => {
  const [userSurveys] = useAtom(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);

  const cardRef = useRef<HTMLDivElement[]>([]);

  const selectedSurvey = surveyData.find((s) => s.id === selectedSurveyId);
  const surveyAnswers = selectedSurvey
    ? userSurveys[selectedSurvey.id]?.answers || {}
    : {};

  // Table Data
  const tableData = selectedSurvey
    ? selectedSurvey.questions.map((q) => ({
        Survey: selectedSurvey.title,
        Question: q.question,
        Answer: surveyAnswers[q.id] || "—",
        Status: surveyAnswers[q.id] ? "Answered" : "Unanswered",
      }))
    : [];

  // Export Functions
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
    XLSX.writeFile(workbook, "Survey_Responses.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Survey Responses Report", 14, 16);
    (doc as any).autoTable({
      startY: 25,
      head: [["Survey", "Question", "Answer", "Status"]],
      body: tableData.map((row) => [
        row.Survey,
        row.Question,
        row.Answer,
        row.Status,
      ]),
    });
    doc.save("Survey_Responses.pdf");
  };

  // GSAP Animations
  useEffect(() => {
    if (!selectedSurveyId) return;
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.2,
    });
  }, [selectedSurveyId]);

  // Chart Data
  const barData = selectedSurvey
    ? selectedSurvey.questions.map((q) => ({
        name: q.question,
        Answered: surveyAnswers[q.id] ? 1 : 0,
        Unanswered: surveyAnswers[q.id] ? 0 : 1,
      }))
    : [];

  const pieData = selectedSurvey
    ? [
        { name: "Answered", value: Object.keys(surveyAnswers).length },
        {
          name: "Unanswered",
          value: selectedSurvey.questions.length -
            Object.keys(surveyAnswers).length,
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[18rem_1fr] gap-6">
      {/* Sidebar 
      <div className=" relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Surveys
          </h2>
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
            {surveyData.map((survey) => (
              <li
                key={survey.id}
                onClick={() => setSelectedSurveyId(survey.id)}
                className={`p-3 rounded-lg cursor-pointer text-sm font-medium transition ${
                  selectedSurveyId === survey.id
                    ? "bg-blue-100 border border-blue-500 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {survey.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content }
      <div>
        {selectedSurvey ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedSurvey.title} — Report
            </h2>

            {/* Summary }
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {["Total Questions", "Answered", "Unanswered"].map((label, i) => {
                const totalQuestions = selectedSurvey.questions.length;
                const answered = Object.keys(surveyAnswers).length;
                const unanswered = totalQuestions - answered;
                const value =
                  label === "Total Questions"
                    ? totalQuestions
                    : label === "Answered"
                    ? answered
                    : unanswered;

                return (
                  <div
                    key={label}
                    ref={(el) => {
                      if (el) cardRef.current[i] = el;
                    }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
                  >
                    <h3 className="text-sm text-gray-500">{label}</h3>
                    <p className="text-3xl font-bold text-blue-600">{value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts }
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Answers per Question
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} barSize={30}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#374151", fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="Answered"
                      fill="#3B82F6"
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      dataKey="Unanswered"
                      fill="#93C5FD"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Answer Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={BLUE_COLORS[i % BLUE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Buttons }
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FiDownload /> Export Excel
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                <FiPrinter /> Export PDF
              </button>
            </div>

            {/* Animated Answer Status }
            <div className="space-y-4">
              {selectedSurvey.questions.map((q, index) => {
                const answered = !!surveyAnswers[q.id];
                const percentage = answered ? 100 : 0;
                return (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          answered ? "bg-blue-600" : "bg-blue-300"
                        }`}
                      ></div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">
                          {q.question}
                        </span>
                        <div className="text-xs text-gray-500">
                          {answered ? "Answered" : "Unanswered"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {percentage}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            answered ? "bg-blue-600" : "bg-blue-300"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a Survey
            </h3>
            <p className="text-gray-600">
              Choose a survey from the left to view its analytics & reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

 */