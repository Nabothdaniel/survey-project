import { useAtom } from "jotai";
import { draftsAtom, surveyAtom } from "../../atoms/adminSurveyAtom";
import { FiEdit3 } from "react-icons/fi";

const DraftsSection = () => {
  const [drafts] = useAtom(draftsAtom);
  const [, setSurvey] = useAtom(surveyAtom);

  if (drafts.length === 0) return null;

  return (
    <div className="mt-10 max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Your Drafts</h3>
      <div className="space-y-3">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div>
              <h4 className="font-medium text-gray-900">{draft.formTitle || "Untitled Survey"}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">
                {draft.formDescription || "No description yet"}
              </p>
            </div>
            <button
              onClick={() => setSurvey(draft)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
            >
              <FiEdit3 /> Continue Editing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsSection;
