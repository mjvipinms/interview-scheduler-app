import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import DashboardContainer from "../../components/DashboardContainer";
import { fetchChangeRequestByPanelId } from "../../services/InterviewChangeRequestService";

export default function PanelChangeRequestList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const panelId = localStorage.getItem("userId");

    const fetchChangeRequests = async () => {
        try {
            setLoading(true);
            const res = await fetchChangeRequestByPanelId(localStorage.getItem("userId"));
            setRequests(res || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load change requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChangeRequests();
    }, []);

    const getStatusClass = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    return (
        <>
            <Navbar />
            <DashboardContainer>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">My Change Requests</h2>
                        <button
                            onClick={fetchChangeRequests}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-gray-500">Loading change requests...</p>
                    ) : requests.length === 0 ? (
                        <p className="text-gray-500">No change requests found.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="border p-2">#</th>
                                    <th className="border p-2">Interview Details</th>
                                    <th className="border p-2">Reason</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((r, idx) => (
                                    <tr key={r.interviewChangeRequestId} className="hover:bg-gray-50">
                                        <td className="border p-2 text-center">{idx + 1}</td>

                                        {/* Interview Details */}
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

                                        {/* Reason */}
                                        <td className="border p-2 text-gray-700">{r.reason}</td>

                                        {/* Status */}
                                        <td className="border p-2 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    r.status
                                                )}`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </DashboardContainer>
        </>
    );
}
