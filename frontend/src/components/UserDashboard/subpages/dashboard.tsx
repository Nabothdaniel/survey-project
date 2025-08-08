import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { fetchSurveysAtom } from "../../../atoms/surveyAtom";
import { FiCalendar, FiClipboard, FiClock, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSurveyStats } from "../../../hooks/useSurveyStats";
import Welcome from "../../ui/Welcome";
import { Spinner } from "../../ui/Spinner";

const Dashboard = () => {
    const {
        surveyData,
        stats,
        getStatus,
        formatStatus,
        getStatusColor,
        loading
    } = useSurveyStats();

    const fetchSurveys = useSetAtom(fetchSurveysAtom);

    useEffect(() => {
        fetchSurveys();
    }, []);

    return (
        <>
            <Welcome />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Stats Cards */}
                <div className="col-span-1 lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard
                        title="New Surveys"
                        count={stats.new}
                        icon={<FiClipboard className="text-blue-600" size={20} />}
                        bgColor="bg-blue-100"
                        textColor="text-blue-600"
                    />
                    <StatCard
                        title="In Progress"
                        count={stats.in_progress}
                        icon={<FiClock className="text-yellow-600" size={20} />}
                        bgColor="bg-yellow-100"
                        textColor="text-yellow-600"
                    />
                    <StatCard
                        title="Completed"
                        count={stats.completed}
                        icon={<FiCheckCircle className="text-green-600" size={20} />}
                        bgColor="bg-green-100"
                        textColor="text-green-600"
                    />
                </div>

                {/* Survey List */}
                <div className="col-span-1 lg:col-span-12">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Available Surveys</h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {loading ? (
                                <div className="flex items-center justify-center h-[60vh]">
                                    <div className="flex flex-col items-center space-y-3">
                                        <Spinner />
                                        <p className="text-blue-600 text-sm font-medium">Loading surveys...</p>
                                    </div>
                                </div>
                            ) : (
                                surveyData.map((survey) => {
                                    const status = getStatus(String(survey.id));
                                    return (
                                        <div
                                            key={survey.id}
                                            className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {survey.title}
                                                        </h3>
                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
                                                        >
                                                            {formatStatus(status)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{survey.description}</p>
                                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <FiCalendar className="mr-1.5" />
                                                            <span>Due: {survey.dueDate}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FiClock className="mr-1.5" />
                                                            <span>Est. 5–10 mins</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/take-survey/${survey.id}`}
                                                    className={`px-4 py-2 text-sm text-center font-medium rounded-lg whitespace-nowrap ${
                                                        status === "completed"
                                                            ? "bg-gray-100 text-gray-700 cursor-not-allowed pointer-events-none"
                                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                                >
                                                    {status === "new" && "Start Survey"}
                                                    {status === "in_progress" && "Continue"}
                                                    {status === "completed" && "Completed"}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// StatCard component
const StatCard = ({
    title,
    count,
    icon,
    bgColor,
    textColor,
}: {
    title: string;
    count: number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
}) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h3 className={`text-2xl font-bold ${textColor} mt-1`}>{count}</h3>
            </div>
            <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;
