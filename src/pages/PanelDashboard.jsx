import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getPanelDashboardSummary } from "../services/DashboardService";
import { useNavigate } from "react-router-dom";


export default function PanelDashboard() {
  const [slotSummary, setSlotSummary] = useState({});
  const [interviewSummary, setInterviewSummary] = useState({ upcomingInterviews: [] });
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getPanelDashboardSummary(localStorage.getItem("userId"));
        setData(res);
        setSlotSummary(res.slotSummaryResponseDto || {});
        setInterviewSummary(res.interviewSummaryResponseDto || {});
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Panel Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">Monthly Slots</h2>
            <p>
              {slotSummary.appliedSlots} / {slotSummary.totalSlotsThisMonth} used
            </p>
            <p className="text-sm text-gray-500">
              Weekly Plan: {slotSummary.weeklyPlanSlots} slots
            </p>
          </div>

          <div
            onClick={() => navigate("/panel/calendar", { state: { defaultView: "SCHEDULED", fromDashboard:true, viewType: "UPCOMING" } })}
            className="cursor-pointer hover:shadow-lg bg-white p-6 rounded-2xl transition-all shadow"
          >
            <h2 className="text-lg font-semibold">Interviews Assigned (This Month)</h2>
            <p className="text-3xl font-bold text-blue-600">
              {interviewSummary.totalAssignedThisMonth ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">View Scheduled Interviews</p>
          </div>

          <div
            onClick={() =>
              navigate("/panel/calendar", {
                state: {
                  fromDashboard: true,
                  viewType: "UPCOMING",
                  interviews: interviewSummary.upcomingInterviews || [],
                },
              })
            }
            className="cursor-pointer hover:shadow-lg bg-white p-6 rounded-2xl transition-all shadow"
          >
            <h2 className="text-lg font-semibold">Upcoming Interviews (This Week)</h2>
            <p className="text-3xl font-bold text-emerald-600">
              {interviewSummary.upcomingInterviews?.length ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Tap to view in Calendar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
