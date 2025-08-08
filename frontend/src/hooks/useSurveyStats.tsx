import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { surveyAtom, fetchSurveysAtom } from "../atoms/surveyAtom";
import { surveyStatusAtom } from "../atoms/surveyStatusAtom";

export const useSurveyStats = () => {
  const [surveyData, setSurveyData] = useAtom(surveyAtom);
  const [surveyStatusMap, setSurveyStatusMap] = useAtom(surveyStatusAtom);
  const [, fetchSurveys] = useAtom(fetchSurveysAtom);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys({
      onDone: () => setLoading(false),
      onError: () => setLoading(false),
    });
  }, [fetchSurveys]);

  const getStatus = (surveyId: string | number) =>
    surveyStatusMap[surveyId.toString()]?.status || "new";

  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

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

  const stats = useMemo(() => {
    const values = Object.values(surveyStatusMap);
    return {
      new: values.filter((s) => s.status === "new").length,
      in_progress: values.filter((s) => s.status === "in_progress").length,
      completed: values.filter((s) => s.status === "completed").length,
    };
  }, [surveyStatusMap]);

  return {
    surveyData,
    setSurveyData,
    surveyStatusMap,
    setSurveyStatusMap,
    getStatus,
    formatStatus,
    getStatusColor,
    loading,
    stats,
  };
};
