import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { fetchSlotsByPanelId, createSlot, updateSlot } from "../../services/slotService";
import { fetchAllInterviewsByPanelId } from "../../services/interviewService";
import SlotModal from "./SlotModel";
import InterviewFeedbackModal from "./InterviewFeedbackModal";
import { toast } from "react-toastify";
import ChangeRequestModal from "./ChangeRequestModal";


const PanelistCalendarPage = () => {
  const [slots, setSlots] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [role, setRole] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const loadData = async () => {
    try {
      const panelistId = localStorage.getItem("userId");
      const [slotsData, interviewsData] = await Promise.all([
        fetchSlotsByPanelId(panelistId),
        fetchAllInterviewsByPanelId(panelistId),
      ]);
      setSlots(slotsData || []);
      setInterviews(interviewsData || []);
    } catch (err) {
      toast.error("Failed to load calendar data");
    }
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (info) => {
    if (isPastDate(info.date)) {
      toast.warn("You cannot create slots in the past.");
      return;
    }
    setSelectedDate(info.dateStr);
    setSelectedSlot(null);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const { slotId, type } = clickInfo.event.extendedProps;

    if (type === "INTERVIEW") {
      const interview = interviews.find((i) => i.slotId === slotId);
      if (interview) {
        setSelectedInterview(interview);
        // show a small action popup
        const confirmAction = window.confirm(
          "Do you want to view feedback or request a change?\n\nClick OK for Feedback, Cancel for Change Request."
        );
        if (confirmAction) {
          setShowFeedbackModal(true);
        } else {
          setShowChangeModal(true);
        }
      } else {
        toast.error("Interview details not found.");
      }
    } else if (type === "SLOT") {
      const slot = slots.find((s) => s.slotId.toString() === slotId.toString());
      if (slot) {
        setSelectedSlot(slot);
        setSelectedDate(slot.startTime.split("T")[0]);
        setShowModal(true);
      }
    }
  };

  const handleSaveSlot = async (slotData) => {
    try {
      const token = localStorage.getItem("token");
      const panelistId = localStorage.getItem("userId");
      const payload = { panelistId, startTime: slotData.startTime, endTime: slotData.endTime };

      if (selectedSlot) {
        await updateSlot(selectedSlot.id, payload, token);
        toast.success("Slot updated successfully!");
      } else {
        await createSlot(payload, token);
        toast.success("Slot created successfully!");
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error("Failed to save slot. Please try again.");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    if (role === "PANEL") loadData();
  }, []);

  const events = [
    ...interviews.map((i) => ({
      slotId: i.slotId,
      title: "Scheduled Interview",
      start: new Date(i.startTime || i.interviewDate).toISOString(),
      backgroundColor: "#22c55e",
      textColor: "white",
      type: "INTERVIEW",
    })),
    ...slots
      .filter((s) => s.status !== "BOOKED")
      .map((slot) => ({
        slotId: slot.slotId,
        title: "Available Slot",
        start: slot.startTime,
        end: slot.endTime,
        backgroundColor: "#facc15",
        textColor: "black",
        type: "SLOT",
      })),
  ];

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
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
          height="auto"
          dayCellDidMount={(info) => {
            if (isPastDate(info.date)) {
              info.el.style.opacity = "0.5";
              info.el.style.pointerEvents = "none";
              info.el.style.backgroundColor = "#f5f5f5";
            }
          }}
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

      {showFeedbackModal && selectedInterview && (
        <InterviewFeedbackModal
          interview={selectedInterview}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
      {showChangeModal && selectedInterview && (
        <ChangeRequestModal
          interview={selectedInterview}
          onClose={() => setShowChangeModal(false)}
        />
      )}
    </div>
  );
};

export default PanelistCalendarPage;
