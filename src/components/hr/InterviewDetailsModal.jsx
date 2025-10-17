import React from "react";

const InterviewDetailsModal = ({ interview, onClose, onEdit, onCancel }) => {
  if (!interview) return null;

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
            <strong>Panel:</strong> {interview.interviewerName || "N/A"}
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
              className={`font-medium ${
                interview.status === "CONFIRMED"
                  ? "text-green-600"
                  : interview.status === "CANCELLED"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {interview.status}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={onCancel}
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
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailsModal;
