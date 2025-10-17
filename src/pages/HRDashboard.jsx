import DashboardContainer from "../components/DashboardContainer";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
//import { getDashboardSummary } from "../services/dashboardService";

export default function HRDashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
       // const res = await getDashboardSummary();
        setData(res);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">HR Dashboard</h1>

        {/* Responsive 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Total Candidates */}
          <div
            onClick={() => navigate("/hr/candidates")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all"
          >
            <h2 className="text-lg font-semibold mb-1 text-gray-700">Total Candidates</h2>
            <p className="text-4xl font-bold text-indigo-600">{data.totalCandidates ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              Assigned: {data.assigned ?? 0} | Pending: {data.pending ?? 0}
            </p>
          </div>

          {/* Interviews Scheduled */}
          <div
            onClick={() => navigate("/hr/interviews")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all"
          >
            <h2 className="text-lg font-semibold mb-1 text-gray-700">Interviews Scheduled</h2>
            <p className="text-4xl font-bold text-blue-600">{data.scheduledInterviews ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              Available Slots: {data.availableSlots ?? 0}
            </p>
          </div>

          {/* Panelists Pending Update */}
          <div
            onClick={() => navigate("/hr/panel-availability")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all"
          >
            <h2 className="text-lg font-semibold mb-1 text-gray-700">Pending Panel Updates</h2>
            <p className="text-4xl font-bold text-red-600">{data.pendingPanelists ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Need to update availability</p>
          </div>

          {/* Upcoming Interviews */}
          <div
            onClick={() => navigate("/hr/upcoming-interviews")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all col-span-1 sm:col-span-2 lg:col-span-1"
          >
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Upcoming Interviews</h2>
            {data.upcoming && data.upcoming.length > 0 ? (
              <ul className="space-y-1">
                {data.upcoming.slice(0, 4).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 border-b pb-1">
                    {item.candidateName} – {item.role} ({item.date})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No upcoming interviews</p>
            )}
          </div>

          {/* Selected / Rejected */}
          <div
            onClick={() => navigate("/hr/candidate-results")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all"
          >
            <h2 className="text-lg font-semibold mb-1 text-gray-700">Selected / Rejected</h2>
            <p className="text-green-600 font-bold text-2xl">
              {data.selected ?? 0} <span className="text-sm text-gray-400">selected</span>
            </p>
            <p className="text-red-500 font-bold text-2xl">
              {data.rejected ?? 0} <span className="text-sm text-gray-400">rejected</span>
            </p>
          </div>

          {/* Available Slots */}
          <div
            onClick={() => navigate("/hr/available-slots")}
            className="cursor-pointer hover:shadow-lg bg-white p-5 rounded-2xl transition-all"
          >
            <h2 className="text-lg font-semibold mb-1 text-gray-700">Available Slots</h2>
            <p className="text-4xl font-bold text-emerald-600">
              {data.availableSlots ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">For this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

