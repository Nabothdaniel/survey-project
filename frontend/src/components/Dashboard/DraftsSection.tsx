import { useAtom } from "jotai";
import { draftsAtom, surveyAtom } from "../../atoms/adminSurveyAtom";
import { FiEdit3, FiTrash } from "react-icons/fi";

const DraftsSection = () => {
  const [drafts, setDrafts] = useAtom(draftsAtom);
  const [, setSurvey] = useAtom(surveyAtom);

  if (drafts.length === 0) return null;

  const removeDraft = (id: string) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== id);
    setDrafts(updatedDrafts);
    localStorage.setItem("surveyDrafts", JSON.stringify(updatedDrafts));
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Your Drafts</h3>
      <div className="space-y-3">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex-1 pr-4">
              <h4 className="font-medium text-gray-900">{draft.formTitle || "Untitled Survey"}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">
                {draft.formDescription || "No description yet"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSurvey(draft)}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
              >
                <FiEdit3 /> Edit
              </button>

              <button
                onClick={() => removeDraft(draft.id)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg flex items-center gap-2"
              >
                <FiTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsSection;
