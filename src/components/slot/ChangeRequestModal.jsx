import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {createChangeRequest} from "../../services/InterviewChangeRequestService";

const ChangeRequestModal = ({ interview, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.warn("Please provide a reason");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const panelId = localStorage.getItem("userId");

      await createChangeRequest({
        interviewId: interview.interviewId,
        panelId: panelId,
        reason: reason,
      });

      toast.success("Change request submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit change request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-3">Request Change</h2>
        <p className="text-gray-600 text-sm mb-4">
          Candidate: <strong>{interview.candidateName}</strong> <br />
          Date: <strong>{new Date(interview.startTime).toLocaleString()}</strong>
        </p>

        <textarea
          className="border border-gray-300 rounded w-full p-2 mb-4"
          placeholder="Enter reason for change..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRequestModal;
