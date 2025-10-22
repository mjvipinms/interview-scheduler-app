import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchSlots, updateSlot } from "../../services/slotService";
import { fetchAllInterviews } from "../../services/interviewService";
import SlotModal from "./SlotModel";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import InterviewDetailsModal from "../hr/InterviewDetailsModal";
import { useLocation } from "react-router-dom";


const HRCalendarPage = () => {
    const [slots, setSlots] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const location = useLocation();
    const [viewType, setViewType] = useState(location.state?.defaultView || "AVAILABLE");
    const [role, setRole] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [warning, setWarning] = useState("");
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);


    //Fetch slots
    const loadSlots = async () => {
        try {
            const data = await fetchSlots();
            setSlots(data || []);
            setWarning(data.length ? "" : "No available slots found.");
        } catch (err) {
            console.error("Error loading slots:", err);
            alert("Failed to load slots");
        }
    };

    //Fetch interviews
    const loadInterviews = async () => {
        try {
            const data = await fetchAllInterviews();
            setInterviews(data || []);
            setWarning(data.length ? "" : "No scheduled interviews found.");

        } catch (err) {
            console.error("Error loading interviews:", err);
            alert("Failed to load interviews");
        }
    };

    //Normalize date format for FullCalendar
    const normalizeDate = (dt) =>
        dt ? (dt.includes("T") ? dt : dt.replace(" ", "T")) : "";

    const formatToLocalISOString = (date) => {
        const pad = (n) => (n < 10 ? "0" + n : n);
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes()) +
            ":" +
            pad(date.getSeconds())
        );
    };
    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to midnight
        return new Date(date) < today;
    };
    const handleEventClick = (clickInfo) => {
        const eventStart = clickInfo.event.start;
        const slotId = clickInfo.event.id;
        const startTime = formatToLocalISOString(clickInfo.event.start);
        const endTime = formatToLocalISOString(clickInfo.event.end);

        if (isPastDate(eventStart)) {
            alert("You cannot modify past events.");
            return;
        }

        setSelectedStartTime(startTime);
        setSelectedEndTime(endTime);

        if (viewType === "AVAILABLE") {
            const slot = slots.find((s) => s.slotId.toString() === slotId.toString());
            if (slot) {
                setSelectedSlot(slot);
                setShowScheduleModal(true);
            }
        } else if (viewType === "SCHEDULED") {
            const interview = interviews.find(
                (i) => i.slotId.toString() === slotId.toString()
            );
            if (interview) {
                setSelectedInterview(interview);
                setShowInterviewModal(true);
            }
        }
    };
    const handleEditInterview = () => {
        setShowInterviewModal(false);
        // Open your scheduling modal pre-filled
        setSelectedSlot(selectedInterview);
        setShowScheduleModal(true);
    };

    const handleUpdateSlot = async (slotData) => {
        try {
            const token = localStorage.getItem("token");
            const payload = {
                startTime: slotData.startTime || selectedSlot.startTime,
                endTime: slotData.endTime || selectedSlot.endTime,
                status: slotData.status,
            };
            await updateSlot(selectedSlot.id, payload, token);
            alert("Slot updated successfully!");
            setShowModal(false);
            await loadSlots();
        } catch (error) {
            console.error("Error updating slot:", error);
            alert("Failed to update slot. Please try again.");
        }
    };

    //Load slots on mount
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
        if (storedRole === "HR") loadSlots();
    }, []);

    // Switch view (Available / Scheduled)
    useEffect(() => {
        if (viewType === "AVAILABLE") {
            // Map available slots
            const availableEvents = slots
                .filter((s) => s.status === "UNBOOKED")
                .map((slot) => ({
                    id: slot.slotId,
                    title: "Available Slot",
                    start: normalizeDate(slot.startTime),
                    end: normalizeDate(slot.endTime),
                    backgroundColor: "#22c55e",
                    textColor: "white",
                    extendedProps: {
                        type: "AVAILABLE",
                        panel: slot.interviewerName || "N/A",
                        status: slot.status,
                        startTime: new Date(slot.startTime).toLocaleString(),
                        endTime: new Date(slot.endTime).toLocaleString(),
                    },
                }));

            setFilteredEvents(availableEvents);
            setWarning(availableEvents.length ? "" : "No available slots found.");
        } else if (viewType === "SCHEDULED") {
            loadInterviews(); // fetch interviews when switching view
        }
    }, [viewType, slots]);

    //Map interviews to calendar events once data is fetched
    useEffect(() => {
        if (viewType === "SCHEDULED" && interviews.length > 0) {
            const interviewEvents = interviews.map((i) => ({
                id: i.slotId,
                title: `Interview - ${i.candidateName || "N/A"}`,
                start: normalizeDate(i.startTime),
                end: normalizeDate(i.endTime),
                backgroundColor: "#3b82f6",
                textColor: "white",
                extendedProps: {
                    type: "SCHEDULED",
                    panel: i.panellistNames || "N/A",
                    candidate: i.candidateName || "N/A",
                    status: "CONFIRMED",
                    startTime: new Date(i.startTime).toLocaleString(),
                    endTime: new Date(i.endTime).toLocaleString(),
                },
            }));
            setFilteredEvents(interviewEvents);
        } else if (viewType === "SCHEDULED" && interviews.length === 0) {
            setFilteredEvents([]);
        }
    }, [interviews, viewType]);

    // Tooltips for events
    const handleEventDidMount = (info) => {
        const props = info.event.extendedProps;
        let tooltipContent = "";

        if (props.type === "AVAILABLE") {
            tooltipContent = `
      <div style="font-size:13px; line-height:1.4;">
        <strong>Panel:</strong> ${props.panel || "N/A"}<br/>
        <strong>Status:</strong> ${props.status || "N/A"}<br/>
        <strong>Start Time:</strong> ${props.startTime || "N/A"}<br/>
        <strong>End Time:</strong> ${props.endTime || "N/A"}
      </div>
    `;
        } else if (props.type === "SCHEDULED") {
            tooltipContent = `
      <div style="font-size:13px; line-height:1.4;">
        <strong>Panels:</strong> ${props.panel || "N/A"}<br/>
        <strong>Candidate:</strong> ${props.candidate || "N/A"}<br/>
        <strong>Start Time:</strong> ${props.startTime || "N/A"}<br/>
        <strong>End Time:</strong> ${props.endTime || "N/A"}<br/>
        <strong>Status:</strong> ${props.status || "N/A"}
      </div>
    `;
        }

        // Destroy any previous tooltip for this element (important!)
        if (info.el._tippy) {
            info.el._tippy.destroy();
        }

        // Create a fresh tooltip for this event element
        tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
            theme: props.type === "AVAILABLE" ? "light-border" : "light",
            placement: "top",
            interactive: true,
            animation: "shift-away-subtle",
            delay: [50, 50],
        });
    };


    // Counters
    const totalAvailableSlots = slots.filter(
        (s) => s.status === "UNBOOKED"
    ).length;
    const totalScheduledInterviews = interviews.length;

    if (!role) {
        return (
            <div className="p-6 text-center text-gray-500">Loading user info...</div>
        );
    }

    if (role !== "HR") {
        return (
            <div className="p-6 text-center text-red-600">
                Access Denied. HR Only.
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">HR Calendar</h2>

            {/* Counters */}
            <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-green-50 text-green-800 font-semibold">
                        Available Slots
                    </div>
                    <div className="text-lg font-medium">{totalAvailableSlots}</div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold">
                        Scheduled Interviews
                    </div>
                    <div className="text-lg font-medium">{totalScheduledInterviews}</div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-4 mb-4 justify-center">
                <button
                    className={`px-4 py-2 rounded-lg font-medium ${viewType === "AVAILABLE"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setViewType("AVAILABLE")}
                >
                    Available Slots
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-medium ${viewType === "SCHEDULED"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                        }`}
                    onClick={() => setViewType("SCHEDULED")}
                >
                    Scheduled Interviews
                </button>
            </div>

            {/* Warning */}
            {warning && (
                <div className="text-center text-yellow-600 font-medium mb-4">
                    {warning}
                </div>
            )}

            {/* Calendar */}
            <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                <FullCalendar
                    dayCellDidMount={(info) => {
                        if (isPastDate(info.date)) {
                            info.el.style.opacity = "0.5";      // fade it
                            info.el.style.pointerEvents = "none"; // disable clicks
                            info.el.style.backgroundColor = "#f5f5f5"; // light gray background
                        }
                    }}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    eventClick={handleEventClick}
                    eventDidMount={handleEventDidMount}
                    events={filteredEvents}
                    height="auto"
                />
            </div>

            {/* Modals */}
            {showScheduleModal && (
                <ScheduleInterviewModal
                    slot={selectedSlot}
                    startTime={selectedStartTime}
                    endTime={selectedEndTime}
                    onClose={() => setShowScheduleModal(false)}
                    onSave={loadSlots}
                />
            )}

            {showModal && (
                <SlotModal
                    slot={selectedSlot}
                    onClose={() => setShowModal(false)}
                    onSave={handleUpdateSlot}
                />
            )}
            {showInterviewModal && (
                <InterviewDetailsModal
                    interview={selectedInterview}
                    onClose={() => setShowInterviewModal(false)}
                    onEdit={handleEditInterview}
                />
            )}

        </div>
    );
};

export default HRCalendarPage;
