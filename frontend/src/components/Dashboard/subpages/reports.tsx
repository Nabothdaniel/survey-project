import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import gsap from "gsap";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { FiBarChart2, FiDownload, FiPrinter } from "react-icons/fi";
import type { TableRow, Survey, SurveyOutcome } from "../../../types";
import { surveyAtom, fetchSurveysAtom } from "../../../atoms/surveyAtom";
import { fetchSurveyOutcomesAtom } from "../../../atoms/surveyOutcomesAtom";

import { toast } from "react-toastify";

import { Spinner } from "../../../components/ui/Spinner";

const BLUE_COLORS = ["#1D4ED8", "#3B82F6", "#60A5FA", "#93C5FD"];

const Reports = () => {
  const [surveys] = useAtom(surveyAtom);
  const [, fetchSurveys] = useAtom(fetchSurveysAtom);
  const [surveyOutcomes, setSurveyOutcomes] = useState<SurveyOutcome[]>([]);
  const [, fetchSurveyOutcomes] = useAtom(fetchSurveyOutcomesAtom);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | number | null>(null);

  const [loadingSurveys, setLoadingSurveys] = useState(false);
  const [loadingOutcomes, setLoadingOutcomes] = useState(false);

  const cardRef = useRef<HTMLDivElement[]>([]);

  const randomId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};



  // Fetch surveys on mount
  useEffect(() => {
    setLoadingSurveys(true);
    fetchSurveys({
      onDone: (fetchedSurveys: Survey[]) => {
        setLoadingSurveys(false);
        if (fetchedSurveys.length > 0) {
          setSelectedSurveyId(fetchedSurveys[0].id);
        }
      },
      onError: () => {
        setLoadingSurveys(false);
        toast.error("Failed to load surveys.");
      }
    });
  }, [fetchSurveys]);

  // Fetch outcomes when a survey is selected
  useEffect(() => {
    if (!selectedSurveyId) return;
    setLoadingOutcomes(true);
    fetchSurveyOutcomes({
      surveyId: selectedSurveyId,
      onDone: (outcomes: SurveyOutcome[]) => {
        console.log(outcomes)
        setSurveyOutcomes(outcomes);
        console.log(outcomes)
        setLoadingOutcomes(false);
      },
      onError: () => {
        setSurveyOutcomes([]);
        setLoadingOutcomes(false);
        toast.error("Failed to load survey outcomes.");
      }
    });
  }, [selectedSurveyId, fetchSurveyOutcomes]);

  const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);

  // Aggregate Data
  const totalQuestions = selectedSurvey?.fields?.length || 0;
  const totalResponses = selectedSurvey?.totalResponses || 0;
  const answeredCount = surveyOutcomes.length;
  const unansweredCount = Math.max(totalQuestions * totalResponses - answeredCount, 0);

  // Table Data
  
const tableData: TableRow[] = selectedSurvey
  ? surveyOutcomes.map((o, idx) => {
      const question = Object.keys(o.data)[0];
      return {
        User: `user-${randomId()}${idx}`,
        Question: question,
        Answer: o.data[question] || "—",
        Status: o.data[question] ? "Answered" : "Unanswered"
      };
    })
  : [];



  // Export Excel with toast feedback
  const exportExcel = () => {
    const toastId = toast.loading("Exporting Excel...");
    try {
      const worksheet = XLSX.utils.json_to_sheet(tableData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
      XLSX.writeFile(workbook, "Survey_Responses.xlsx");
      toast.update(toastId, { render: "Excel exported successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      toast.update(toastId, { render: "Failed to export Excel.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // Export PDF with toast feedback
  const exportPDF = () => {
    const toastId = toast.loading("Exporting PDF...");
    try {
      const doc = new jsPDF();
      doc.text("Survey Responses Report", 14, 16);

      autoTable(doc, {
        startY: 25,
        head: [["User", "Question", "Answer", "Status"]],
        body: tableData.map((row: TableRow) => [
          row.User,
          row.Question,
          row.Answer,
          row.Status,
        ]),
      });

      doc.save("Survey_Responses.pdf");
      toast.update(toastId, {
        render: "PDF exported successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to export PDF.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };


  // GSAP animation for cards on survey or outcomes change
  useEffect(() => {
    if (!selectedSurveyId) return;
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.2
    });
  }, [selectedSurveyId, surveyOutcomes]);

  // Chart Data with Q1, Q2... and full question text stored for tooltip
  const questions = selectedSurvey?.fields || [];
  const barData = questions.map((question: string, idx: number) => {
    const answered = surveyOutcomes.filter(o => o.data[question]).length;
    const unanswered = totalResponses - answered;
    return {
      name: `Q${idx + 1}`,      // short label for X-axis
      fullQuestion: question,    // full question for tooltip
      Answered: answered,
      Unanswered: unanswered
    };
  });

  const pieData = [
    { name: "Answered", value: answeredCount },
    { name: "Unanswered", value: unansweredCount }
  ];

  return (
    <div className="md:max-w-7xl mx-auto px-3 py-8 grid lg:grid-cols-[18rem_1fr] gap-6">
      {/* Sidebar */}
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Surveys
          </h2>
          {loadingSurveys ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
              {surveys.map((survey) => (
                <li
                  key={survey.id}
                  onClick={() => setSelectedSurveyId(survey.id)}
                  className={`p-3 rounded-lg cursor-pointer text-sm font-medium transition ${selectedSurveyId === survey.id
                    ? "bg-blue-100 border border-blue-500 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {survey.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div>
        {loadingOutcomes ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : selectedSurvey ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedSurvey.title} — Report
            </h2>

            {/* Summary */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {["Total Questions", "Answered", "Unanswered"].map((label, i) => {
                const value =
                  label === "Total Questions"
                    ? totalQuestions
                    : label === "Answered"
                      ? answeredCount
                      : unansweredCount;

                return (
                  <div
                    key={label}
                    ref={el => {
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

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Answers per Question
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={barData}
                    barSize={30}
                    margin={{ top: 10, right: 20, bottom: 50, left: 20 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#1E40AF", fontWeight: "600", fontSize: 13 }}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#1E40AF", fontWeight: "600" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.1)" }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = barData.find(d => d.name === label);
                          return (
                            <div className="bg-white p-2 rounded shadow-lg border border-gray-300 text-sm max-w-xs">
                              <div className="font-semibold mb-1">{data?.fullQuestion}</div>
                              {payload.map((entry, index) => (
                                <div key={index} style={{ color: entry.color }}>
                                  {entry.name}: {entry.value}
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="Answered" fill="#3B82F6" radius={[10, 10, 0, 0]} />
                    <Bar dataKey="Unanswered" fill="#93C5FD" radius={[10, 10, 0, 0]} />
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
                        <Cell key={i} fill={BLUE_COLORS[i % BLUE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Buttons */}
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
