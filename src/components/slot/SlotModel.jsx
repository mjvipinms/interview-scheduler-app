import React, { useState, useEffect } from "react";

const SlotModal = ({ date, slot, onClose, onSave }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (slot) {
      const start = slot.startTime.split("T")[1].slice(0, 5);
      const end = slot.endTime.split("T")[1].slice(0, 5);
      setStartTime(start);
      setEndTime(end);
    }
  }, [slot]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDateTime = `${date}T${startTime}`;
    const endDateTime = `${date}T${endTime}`;

    onSave({ startTime: startDateTime, endTime: endDateTime });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {slot ? "Edit Slot" : "Create Slot"}{" "}
          <span className="text-blue-600">{new Date(date).toDateString()}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {slot ? "Update Slot" : "Save Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;
