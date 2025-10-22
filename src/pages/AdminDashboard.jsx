
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminSummary } from "../services/DashboardService";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    hrUsers: { active: 0, inactive: 0 },
    panelists: { active: 0, inactive: 0 },
    candidates: { active: 0, inactive: 0 },
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const fetchAdminSummary = async () => {
    try {
      const data = await getAdminSummary();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching admin summary:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => navigate("/users/role/HR")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">HR Users</h2>
            <div className="flex justify-between text-gray-600">
              <span>Active</span>
              <span className="font-bold text-green-600">{summary.hrUsers.activeCount}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Inactive</span>
              <span className="font-bold text-red-600">{summary.hrUsers.inactiveCount}</span>
            </div>
          </div>


          <div
            onClick={() => navigate("/users/role/Panel")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Panellist</h2>
            <div className="flex justify-between text-gray-600">
              <span>Active</span>
              <span className="font-bold text-green-600">{summary.panelists.activeCount}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Inactive</span>
              <span className="font-bold text-red-600">{summary.panelists.inactiveCount}</span>
            </div>
          </div>


          <div
            onClick={() => navigate("/users/role/CANDIDATE")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Candidate</h2>
            <div className="flex justify-between text-gray-600">
              <span>Active</span>
              <span className="font-bold text-green-600">{summary.candidates.activeCount}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Inactive</span>
              <span className="font-bold text-red-600">{summary.candidates.inactiveCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
