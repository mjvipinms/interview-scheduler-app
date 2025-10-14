import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <DashboardContainer title="Admin Dashboard">
        <p>Welcome, Admin. Manage users and system settings here.</p>
      </DashboardContainer>
    </>
  );
}
