import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getPendingChangeRequest,bulkUpdateChangeRequest } from "../../services/InterviewChangeRequestService";

export default function HRChangeRequestList() {
    const [requests, setRequests] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        try {

            const res = await getPendingChangeRequest();
            setRequests(res);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load change requests");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === requests.length) {
            setSelected([]);
        } else {
            setSelected(requests.map((r) => r.interviewChangeRequestId));
        }
    };

    const handleApproveSelected = async () => {
        if (selected.length === 0) {
            toast.warn("Please select at least one request");
            return;
        }

        setLoading(true);
        try {
            await bulkUpdateChangeRequest(selected);

            toast.success(`Approved ${selected.length} change requests`);
            setSelected([]);
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error("Bulk approval failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pending Change Requests</h2>

            <div className="mb-4 flex justify-between items-center">
                <button
                    onClick={handleApproveSelected}
                    disabled={loading || selected.length === 0}
                    className={`px-4 py-2 rounded text-white ${loading || selected.length === 0
                        ? "bg-gray-400"
                        : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading ? "Approving..." : `Approve Selected (${selected.length})`}
                </button>
                <button
                    onClick={fetchRequests}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Refresh
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-sm">
                        <th className="border p-2">
                            <input
                                type="checkbox"
                                checked={selected.length === requests.length && requests.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="border p-2">#</th>
                        <th className="border p-2">Interview Details</th>
                        <th className="border p-2">Panel Name</th>
                        <th className="border p-2">Reason</th>
                        <th className="border p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r) => (
                        <tr key={r.interviewChangeRequestId}>
                            <td className="border p-2 text-center">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(r.interviewChangeRequestId)}
                                    onChange={() => toggleSelect(r.interviewChangeRequestId)}
                                />
                            </td>
                            <td className="border p-2">{r.interviewChangeRequestId}</td>
                            <td className="border p-2 text-sm text-gray-700 align-top">
                                <div className="flex flex-col space-y-1">
                                    {/* 👤 Candidate Name */}
                                    <span className="text-base font-semibold text-gray-900 mb-1">
                                        👤 {r.interviewResponseDto?.candidateName || "Unknown Candidate"}
                                    </span>

                                    {/* 🕒 Start Time */}
                                    <span className="text-gray-700">
                                        🕒{" "}
                                        {r.interviewResponseDto?.startTime
                                            ? new Date(r.interviewResponseDto.startTime).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })
                                            : "N/A"}
                                    </span>

                                    {/* 🎯 Interview Type */}
                                    <span className="text-blue-600 font-medium">
                                        🎯 {r.interviewResponseDto?.interviewType || "N/A"}
                                    </span>

                                    {/* 🟢 Status Badge */}
                                    <span
                                        className={`text-xs mt-1 inline-block px-2 py-1 rounded-full w-fit ${r.interviewResponseDto?.interviewStatus === "CONFIRMED"
                                                ? "bg-green-100 text-green-800"
                                                : r.interviewResponseDto?.interviewStatus === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {r.interviewResponseDto?.interviewStatus || "UNKNOWN"}
                                    </span>
                                </div>
                            </td>


                            <td className="border p-2 text-sm text-gray-800">
                                {r.interviewResponseDto?.panellistNames?.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1">
                                        {r.interviewResponseDto.panellistNames.map((name, idx) => (
                                            <li key={idx}>{name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-400">No panelists</span>
                                )}
                            </td>

                            <td className="border p-2">{r.reason}</td>
                            <td className="border p-2">{r.status}</td>
                        </tr>
                    ))}
                    {requests.length === 0 && (
                        <tr>
                            <td className="border p-3 text-center text-gray-500" colSpan={6}>
                                No pending change requests
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
