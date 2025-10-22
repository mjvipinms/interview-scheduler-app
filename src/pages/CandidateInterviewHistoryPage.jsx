import React, { useEffect, useState } from "react";
import { useParams, useNavigate ,useLocation} from "react-router-dom";
import { fetchAllInterviewsByCandidateId } from "../services/interviewService";
import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";
import { toast } from "react-toastify";

export default function CandidateInterviewHistoryPage() {
  const { id } = useParams(); // Candidate ID from route
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const candidateName = location.state?.candidateName || "Candidate";

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const data = await fetchAllInterviewsByCandidateId(id);
      setInterviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching interview history:", err);
      toast.error("Failed to load interview history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <DashboardContainer title={`Interview History - ${candidateName}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">{candidateName}'s Interview History</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        {loading ? (
          <p>Loading interview history...</p>
        ) : interviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No interview records found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Interview Date</th>
                <th className="p-2 border">Panelist</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Feedback</th>
                <th className="p-2 border">Rating</th>
              </tr>
            </thead>
            
            <tbody>
              {interviews.map((interview, index) => (
                <tr key={interview.id || index} className="hover:bg-sky-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{new Date(interview.startTime).toLocaleString()}</td>
                  <td className="border p-2">
                    {interview.panellistNames ? interview.panellistNames.join(", ") : "—"}
                  </td>
                  <td className="border p-2">{interview.interviewType}
                  </td>
                  <td className="border p-2">{interview.interviewStatus}
                  </td>
                  <td className="border p-2">
                    {interview.feedback ? interview.feedback : "—"}
                  </td>
                  <td className="border p-2 text-center">
                    {interview.result ? interview.result : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DashboardContainer>
    </>
  );
}
