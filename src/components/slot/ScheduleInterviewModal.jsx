import React, { useEffect, useState } from "react";
import { fetchPanelists, fetchCandidates, scheduleInterview, rescheduleInterview } from "../../services/interviewService";
import { fetchAvailableSlots } from "../../services/slotService";
import { getAvailablePanelists, getAllUsersByRole } from "../../api/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleInterviewModal = ({ slot, startTime, endTime, onClose, onSave, interview, viewType }) => {
    const [panelists, setPanelists] = useState([]);
    const [selectedPanelists, setSelectedPanelists] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [interviewType, setInterviewType] = useState("");
    const [slots, setSlots] = useState([]); // NEW
    const [selectedSlot, setSelectedSlot] = useState(null); // NEW

    useEffect(() => {
        loadCandidates();
        if (viewType === "SCHEDULED") {
            loadAvailableSlots();
        } else {
            loadPanelists();
        }

        if (interview) {
            setSelectedCandidate(interview.candidateId || "");
            setInterviewType(interview.interviewType || "");
            setSelectedPanelists(interview.panellistIds || []);
        }
    }, [interview]);

    const loadPanelists = async (start = startTime, end = endTime) => {
        try {
            const data = await getAvailablePanelists(start, end);
            setPanelists(data);
        } catch (err) {
            console.error("Error loading panelists", err);
        }
    };

    const loadCandidates = async () => {
        const data = await getAllUsersByRole("CANDIDATE");
        setCandidates(data);
    };

    const loadAvailableSlots = async () => {
        try {
            const data = await fetchAvailableSlots();
            setSlots(data);
        } catch (err) {
            console.error("Error loading slots", err);
        }
    };

    const handleSlotChange = async (slotId) => {
        const selected = slots.find((s) => String(s.slotId) === String(slotId));
        if (!selected) return;
        setSelectedSlot(selected);
        setSelectedPanelists([]);
        await loadPanelists(selected.startTime, selected.endTime);
    };

    const handlePanelistToggle = (id) => {
        setSelectedPanelists((prev) =>
            prev.includes(id)
                ? prev.filter((pid) => pid !== id)
                : prev.length < 3
                    ? [...prev, id]
                    : prev
        );
    };

    const handleSubmit = async () => {
        const payload = {
            candidateId: selectedCandidate,
            panelistIds: selectedPanelists,
            slotId: selectedSlot ? selectedSlot.slotId : slot.slotId,
            hrId: localStorage.getItem("userId"),
            startTime: selectedSlot ? selectedSlot.startTime : startTime,
            endTime: selectedSlot ? selectedSlot.endTime : endTime,
            interviewType,
        };

        try {
            const response =
                viewType === "SCHEDULED"
                    ? await rescheduleInterview(interview.interviewId, payload)
                    : await scheduleInterview(payload);

            if (response.accessStatus && response.accessStatus !== "Success") {
                toast.error(response.accessStatus);
                return;
            }

            toast.success(
                viewType === "SCHEDULED"
                    ? "Interview rescheduled successfully!"
                    : "Interview created successfully!"
            );
            setTimeout(() => {
                onSave();
                onClose();
            }, 1600);
        } catch (error) {
            console.error("Error scheduling interview:", error);
            toast.error("Failed to schedule interview");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-semibold mb-4">
                    {viewType === "SCHEDULED" ? "Reschedule Interview" : "Schedule Interview"}
                </h3>

                <div className="space-y-4">
                    {viewType === "SCHEDULED" && (
                        <div>
                            <label className="block text-sm font-medium">Select New Slot</label>
                            <select
                                value={selectedSlot?.slotId || ""}
                                onChange={(e) => handleSlotChange(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="">Select Slot</option>
                                {slots.map((s) => (
                                    <option key={s.slotId} value={s.slotId}>
                                        {`${new Date(s.startTime).toLocaleString()} - ${new Date(
                                            s.endTime
                                        ).toLocaleString()}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium">Panelists (max 3)</label>
                        <div className="max-h-40 overflow-y-auto border rounded p-2">
                            {panelists.map((p) => (
                                <label key={p.userId} className="block">
                                    <input
                                        type="checkbox"
                                        value={p.userId}
                                        checked={selectedPanelists.includes(p.userId)}
                                        onChange={() => handlePanelistToggle(p.userId)}
                                        className="mr-2"
                                    />
                                    {p.userName || p.name || p.email}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Candidate & Type */}
                    <div>
                        <label className="block text-sm font-medium">Candidate</label>
                        <select
                            value={selectedCandidate}
                            onChange={(e) => setSelectedCandidate(e.target.value)}
                            className="w-full border rounded p-2"
                            disabled={viewType === "SCHEDULED"}
                        >
                            <option value="">Select Candidate</option>
                            {candidates.map((c) => (
                                <option key={c.userId} value={c.userId}>
                                    {c.userName || c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Interview Type</label>
                        <select
                            value={interviewType}
                            onChange={(e) => setInterviewType(e.target.value)}
                            className="w-full border rounded p-2"
                            disabled={viewType === "SCHEDULED"}
                        >
                            <option value="">Select Type</option>
                            <option value="TECHNICAL">Technical</option>
                            <option value="MANAGERIAL">Managerial</option>
                            <option value="HR">HR Round</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedCandidate || selectedPanelists.length === 0 || !interviewType}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {viewType === "AVAILABLE" ? "Create Interview" : "Reschedule Interview"}
                        </button>
                    </div>
                </div>

                <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
