import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";

export default function HRDashboard() {
  return (
    <>
      <Navbar />
      <DashboardContainer title="HR Dashboard">
        <p>Welcome, HR. Manage schedules and candidates here.</p>
      </DashboardContainer>
    </>
  );
}
