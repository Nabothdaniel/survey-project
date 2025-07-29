import { useAtom } from "jotai";
import { surveyData, userSurveysAtom } from "../../../atoms/surveyAtom";
import { FiBarChart2, FiDownload, FiPrinter } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const COLORS = ["#3B82F6", "#FACC15", "#22C55E"];

const Reports = () => {
  const [userSurveys] = useAtom(userSurveysAtom);

  const total = surveyData.length;
  const completed = Object.values(userSurveys).filter((s) => s.status === "completed").length;
  const inProgress = Object.values(userSurveys).filter((s) => s.status === "in_progress").length;
  const newSurveys = total - completed - inProgress;

  const barData = surveyData.map((s) => ({
    name: s.title,
    Completed: userSurveys[s.id]?.status === "completed" ? 1 : 0,
    "In Progress": userSurveys[s.id]?.status === "in_progress" ? 1 : 0,
    New: !userSurveys[s.id] ? 1 : 0,
  }));

  const pieData = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "New", value: newSurveys },
  ];

  // Prepare Table Data
  const tableData = surveyData.flatMap((survey) => {
    const answers = userSurveys[survey.id]?.answers || {};
    return survey.questions.map((q) => ({
      Survey: survey.title,
      Question: q.question,
      Answer: answers[q.id] || "—",
      Status: userSurveys[survey.id]?.status || "Not Started",
    }));
  });

  // Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");
    XLSX.writeFile(workbook, "Survey_Responses.xlsx");
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Survey Responses Report", 14, 16);
    (doc as any).autoTable({
      startY: 25,
      head: [["Survey", "Question", "Answer", "Status"]],
      body: tableData.map((row) => [row.Survey, row.Question, row.Answer, row.Status]),
    });
    doc.save("Survey_Responses.pdf");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FiBarChart2 /> Survey Reports
      </h1>

      {/* Top Summary */}
      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h3 className="text-sm text-gray-500">Total Surveys</h3>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h3 className="text-sm text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border text-center">
          <h3 className="text-sm text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600">{inProgress}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Survey Completion by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#22C55E" />
              <Bar dataKey="In Progress" fill="#FACC15" />
              <Bar dataKey="New" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Overall Survey Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Survey Responses</h2>
          <div className="flex gap-3">
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiDownload /> Export Excel
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiPrinter /> Export PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Survey</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Question</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Answer</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{row.Survey}</td>
                  <td className="px-4 py-2">{row.Question}</td>
                  <td className="px-4 py-2">{row.Answer}</td>
                  <td className="px-4 py-2">{row.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
