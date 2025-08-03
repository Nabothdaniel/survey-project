import Welcome from "../../ui/Welcome";
import FormSection from "../../../components/Dashboard/FormSection";
import DraftsSection from "../../../components/Dashboard/DraftsSection";

const IndexPage = () => {
  return (
    <div>
      {/* Welcome */}
      <Welcome />

      {/* Form Creator */}
      <FormSection />
      {/* Drafts Section */}
      <DraftsSection />
    </div>
  )
}

export default IndexPage
