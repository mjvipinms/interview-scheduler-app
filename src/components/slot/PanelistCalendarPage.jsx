import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchSlotsByPanelId, createSlot, updateSlot } from "../../services/slotService";
import SlotModal from "./SlotModel";

const PanelistCalendarPage = () => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); 
  const [role, setRole] = useState(null);

  const loadSlots = async () => {
    try {
      const data = await fetchSlotsByPanelId(localStorage.getItem("userId"));
      setSlots(data);
    } catch (err) {
      console.error("Error loading slots:", err);
      alert("Failed to load slots");
    }
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedSlot(null); 
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const slotId = clickInfo.event.id;
    const slot = slots.find((s) => s.id.toString() === slotId.toString());
    setSelectedSlot(slot);
    setSelectedDate(slot.startTime.split("T")[0]);
    setShowModal(true);
  };

  const handleSaveSlot = async (slotData) => {
    try {
      const token = localStorage.getItem("token");
      const panelistId = localStorage.getItem("userId");

      const payload = {
        panelistId,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
      };

      if (selectedSlot) {
        await updateSlot(selectedSlot.id, payload, token);
        alert("Slot updated successfully!");
      } else {
        await createSlot(payload, token);
        alert("Slot created successfully!");
      }

      setShowModal(false);
      await loadSlots();
    } catch (error) {
      console.error("Error saving slot:", error);
      alert("Failed to save slot. Please try again.");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    if (role === "PANEL") loadSlots();
  }, []);

  const events = slots.map((slot) => ({
    id: slot.id,
    title: slot.status,
    start: slot.startTime,
    end: slot.endTime,
    backgroundColor:
      slot.status === "AVAILABLE"
        ? "#22c55e"
        : slot.status === "TENTATIVE"
        ? "#facc15"
        : slot.status === "CONFIRMED"
        ? "#3b82f6"
        : "#9ca3af",
    textColor: "white",
  }));

  if (!role) {
    return <div className="p-6 text-center text-gray-500">Loading user info...</div>;
  }

  if (role !== "PANEL") {
    return <div className="p-6 text-center text-red-600">Access Denied. Panelist Only.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Panelist Calendar</h2>

      <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick} 
          events={events}
          height="auto"
        />
      </div>

      {showModal && (
        <SlotModal
          date={selectedDate}
          slot={selectedSlot} 
          onClose={() => setShowModal(false)}
          onSave={handleSaveSlot}
        />
      )}
    </div>
  );
};

export default PanelistCalendarPage;
