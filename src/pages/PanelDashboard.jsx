import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";

export default function PanelDashboard() {
  return (
    <>
      <Navbar />
      <DashboardContainer title="Panel Dashboard">
        <p>Welcome, Panel member. View your interview assignments here.</p>
      </DashboardContainer>
    </>
  );
}
