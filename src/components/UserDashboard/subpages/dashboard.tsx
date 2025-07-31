import { FiCalendar, FiClipboard, FiClock, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { surveyData, userSurveysAtom } from "../../../atoms/surveyAtom";
import Welcome from "../../ui/Welcome";

const Dashboard = () => {
    const [userSurveys] = useAtom(userSurveysAtom);

    const getStatus = (surveyId: number) => {
        return userSurveys[surveyId]?.status || "new";
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status: string) =>
        status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    // calculate stats dynamically
    const stats = {
        new: surveyData.filter((s) => getStatus(s.id) === "new").length,
        in_progress: surveyData.filter((s) => getStatus(s.id) === "in_progress").length,
        completed: surveyData.filter((s) => getStatus(s.id) === "completed").length,
    };

    return (
        <>
            {/* Welcome Section */}

            <Welcome />
            {/* Survey Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Statistics Cards */}
                <div className="col-span-1 lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* New Surveys */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">New Surveys</p>
                                <h3 className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</h3>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FiClipboard className="text-blue-600" size={20} />
                            </div>
                        </div>
                    </div>
                    {/* In Progress */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">In Progress</p>
                                <h3 className="text-2xl font-bold text-yellow-600 mt-1">{stats.in_progress}</h3>
                            </div>
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <FiClock className="text-yellow-600" size={20} />
                            </div>
                        </div>
                    </div>
                    {/* Completed */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Completed</p>
                                <h3 className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</h3>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <FiCheckCircle className="text-green-600" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Surveys */}
                <div className="col-span-1 lg:col-span-12">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Available Surveys
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {surveyData.map((survey) => {
                                const status = getStatus(survey.id);
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
                                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                            status
                                                        )}`}
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
                                                        <span>Est. 5-10 mins</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                to={`/take-survey/${survey.id}`}
                                                className={`px-4 py-2 text-sm text-center font-medium rounded-lg whitespace-nowrap ${status === "completed"
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
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
