import Welcome from "../../ui/Welcome";
import { useAtomValue } from "jotai";
import { profileAtom } from "../../../atoms/profileAtom";
import FormSection from "../../../components/Dashboard/FormSection";
import DraftsSection from "../../../components/Dashboard/DraftsSection";

const IndexPage = () => {
    const profile = useAtomValue(profileAtom);
  return (
    <div>
      {/* Welcome */}
      <Welcome profile={profile} />

      {/* Form Creator */}
      <FormSection />
      {/* Drafts Section */}
      <DraftsSection />
    </div>
  )
}

export default IndexPage
