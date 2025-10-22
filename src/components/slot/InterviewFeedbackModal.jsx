import React, { useState } from "react";
import { toast } from "react-toastify";
import { updateInterview } from "../../services/interviewService";

const InterviewFeedbackModal = ({ interview, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (!feedback || rating === 0) {
      toast.warn("Please provide both feedback and rating.");
      return;
    }
    try {
      const payload = {
        feedback,
        rating,
      };
      await updateInterview(interview.interviewId, payload);
      toast.success("Feedback submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating interview:", error);
      const errorMessage =
        error.response?.data?.accessStatus ||
        error.response?.data ||
        error.message ||
        "Failed to submit feedback.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Provide Feedback
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Interview with candidate <strong>{interview.candidateName}</strong>
        </p>

        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Enter feedback..."
          rows="4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Rating (1–5)
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`w-8 h-8 rounded-full ${rating >= num ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                onClick={() => setRating(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;
