import React from "react";
import { useState } from "react";
import { cancelInterview } from "../../services/interviewService";
import { toast } from "react-toastify";


const InterviewDetailsModal = ({ interview, onClose, onEdit }) => {
  const [loading, setLoading] = useState(false);

  if (!interview) return null;
  const handleCancelInterview = async () => {
    if (!interview.interviewId) return;
    if (!window.confirm("Are you sure you want to cancel this interview?")) return;

    try {
      setLoading(true);
      await cancelInterview(interview.interviewId);
      toast.success("Interview cancelled successfully");
      onClose(); // close modal
    } catch (error) {
      console.error("Failed to cancel interview:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Interview Details
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Candidate:</strong> {interview.candidateName || "N/A"}
          </p>
          <p>
            <strong>Panel:</strong> {interview.panellistNames && interview.panellistNames.length > 0
              ? interview.panellistNames.join(", ")
              : "N/A"}

          </p>
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(interview.startTime).toLocaleString()}
          </p>
          <p>
            <strong>End Time:</strong>{" "}
            {new Date(interview.endTime).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-medium ${interview.status === "CONFIRMED"
                ? "text-green-600"
                : interview.status === "CANCELLED"
                  ? "text-red-600"
                  : "text-yellow-600"
                }`}
            >
              {interview.interviewStatus}
            </span>
          </p>
          <p>
            <strong>Mode:</strong>{" "}
            {interview.mode}
          </p>
          <p>
            <strong>Type:</strong>{" "}
            {interview.interviewType}
          </p>
          <p>
            <strong>Result:</strong>{" "}
            {interview.result}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between items-center">
          {interview?.isDeleted ? (
            <>
              <p className="text-red-600 font-medium text-center flex-1">
                Deleted Interview
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ml-4"
              >
                Close
              </button>
            </>
          ) : interview?.interviewStatus === "COMPLETED" ? (
            <>
              <p className="text-green-600 font-medium text-center flex-1">
                Completed Interview
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ml-4"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reschedule
              </button>

              <button
                onClick={handleCancelInterview}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Interview
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default InterviewDetailsModal;
