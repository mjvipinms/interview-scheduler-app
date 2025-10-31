import React, { useEffect, useState } from "react";
import { getHrReports } from "../../services/ReportService";
/**
 * HrReportPage.jsx
 * - Single-file React component for HR reports
 * - Tailwind CSS for styling (no imports needed here)
 * - Server integration point: GET /api/reports?type=...&startDate=...&endDate=...&page=...&size=...&sortField=...&sortDir=...
 *
 * Features:
 * - Date range picker, report type selector, quick search
 * - Server-side pagination & sorting hooks
 * - CSV export of current page
 * - Dynamic columns per report type
 */

const REPORT_TYPES = [
    { value: "interview", label: "Interview" },
    { value: "slots", label: "Slots" },
    { value: "candidate", label: "Candidate" },
    { value: "panels", label: "Panels" },
];

const defaultPageSize = 25;

function formatDateISO(d) {
    if (!d) return "";
    const dt = new Date(d);
    return dt.toISOString();
}

function csvEscape(value) {
    if (value === null || value === undefined) return '""';
    return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadCSV(filename, headers, rows) {
    const lines = [headers.join(",")];
    for (const r of rows) lines.push(r.map(csvEscape).join(","));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export default function HrReportPage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [type, setType] = useState(REPORT_TYPES[0].value);
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(defaultPageSize);
    const [sortField, setSortField] = useState(null);
    const [sortDir, setSortDir] = useState("asc");

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReport();
    }, [page, size, sortField, sortDir]);

    async function fetchReport({ resetPage = false } = {}) {
        if (resetPage) setPage(1);
        setLoading(true);
        setError(null);

        try {
            const response = await getHrReports({
                type,
                startDate: startDate ? formatDateISO(startDate) : null,
                endDate: endDate ? formatDateISO(endDate) : null,
                page: resetPage ? 1 : page,
                size,
                sortField,
                sortDir,
            });

            setData(response.data || []);
            setTotal(response.total || 0);
            setPage(response.page || (resetPage ? 1 : page));
        } catch (err) {
            console.error("Error fetching report:", err);
            setError(err.message || "Failed to fetch report");
        } finally {
            setLoading(false);
        }
    }
    function onTypeChange(e) {
        setType(e.target.value);
        setPage(1);
    }
    useEffect(() => {
        fetchReport({ resetPage: true });
    }, [type]);

    function handleSort(field) {
        if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else {
            if (type === "interview" && field === "status") {
                setSortField("interview_status");
            } else {
                setSortField(field);
            }
            setSortDir("asc");
        }
    }
    function renderColumns() {
        switch (type) {
            case "interview":
                return [
                    { key: "serial", label: "#", sortable: false },
                    { key: "interviewId", label: "Interview ID", sortable: true },
                    { key: "startTime", label: "Scheduled At", sortable: true },
                    { key: "candidateName", label: "Candidate", sortable: true },
                    { key: "panelNames", label: "Panelists", sortable: false },
                    { key: "status", label: "Status", sortable: true },
                ];
            case "slots":
                return [
                    { key: "serial", label: "#", sortable: false },
                    { key: "slotId", label: "Slot ID", sortable: true },
                    { key: "createdAt", label: "Created Date", sortable: true },
                    { key: "startTime", label: "Start", sortable: true },
                    { key: "endTime", label: "End", sortable: true },
                    { key: "status", label: "Status", sortable: true },
                ];
            case "candidate":
                return [
                    { key: "serial", label: "#", sortable: false },
                    { key: "fullName", label: "Name", sortable: true },
                    { key: "email", label: "Email", sortable: true },
                    { key: "phone", label: "Phone", sortable: true }
                ];
            case "panels":
                return [
                    { key: "serial", label: "#", sortable: false },
                    { key: "fullName", label: "Name", sortable: true },
                    { key: "email", label: "Email", sortable: true },
                    { key: "phone", label: "Phone", sortable: true }
                ];
            default:
                return [];
        }
    }
    function formatUtcToReadable(dateStr) {
        if (!dateStr) return "-";

        const d = new Date(dateStr);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(d.getUTCDate()).padStart(2, "0");

        let hours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;

        return `${yyyy}-${mm}-${dd} ${hours}:${minutes} ${ampm}`;
    }
    function renderCell(row, col, idx) {
        if (col.key === "serial") {
            return (page - 1) * size + idx + 1;
        }
        const v = row[col.key];
        if (col.key === "startTime" || col.key === "endTime" || col.key === "createdAt" || col.key === "date") {
            return v ? formatUtcToReadable(v) : "-";
        }
        if (col.key === "panelists" && Array.isArray(v)) {
            return v.map((p) => p.name).join(", ");
        }
        return v === null || v === undefined ? "-" : String(v);
    }

    function onExportCSV() {
        const cols = renderColumns();
        const headers = cols.map((c) => c.label);
        const rows = data.map((r) =>
            cols.map((c) =>
                Array.isArray(r[c.key]) ? r[c.key].map((x) => x.name).join(", ") : r[c.key] ?? ""
            )
        );
        downloadCSV(`${type}-report.csv`, headers, rows);
    }

    const columns = renderColumns();
    const totalPages = Math.max(1, Math.ceil(total / size));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">HR Reports</h1>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Report Type</label>
                            <select value={type} onChange={onTypeChange} className="w-full border rounded p-2">
                                {REPORT_TYPES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">&nbsp;</label>
                            <button
                                onClick={() => fetchReport({ resetPage: true })}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Run
                            </button>

                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm">Page size</label>
                            <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="border rounded p-1">
                                {[10, 25, 50, 100].map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={onExportCSV} className="px-3 py-1 border rounded">
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                    {loading ? (
                        <div className="py-12 text-center">Loading...</div>
                    ) : error ? (
                        <div className="py-6 text-red-600">Error: {error}</div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="text-left">
                                            {columns.map((col) => (
                                                <th
                                                    key={col.key}
                                                    className="p-2 border-b cursor-pointer"
                                                    onClick={() => col.sortable && handleSort(col.key)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{col.label}</span>
                                                        {col.sortable && sortField === col.key && (
                                                            <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>
                                                        )}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length === 0 ? (
                                            <tr>
                                                <td className="p-4" colSpan={columns.length}>
                                                    No results for selected range.
                                                </td>
                                            </tr>
                                        ) : (
                                            data.map((row, idx) => (
                                                <tr key={row.id ?? idx} className="hover:bg-gray-50">
                                                    {columns.map((col) => (
                                                        <td key={col.key} className="p-2 align-top border-b">
                                                            {renderCell(row, col, idx)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm">
                                    Showing {data.length} of {total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        className="px-2 py-1 border rounded"
                                        disabled={page <= 1}
                                    >
                                        Prev
                                    </button>
                                    <div className="px-3 py-1 border rounded">
                                        Page {page} / {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        className="px-2 py-1 border rounded"
                                        disabled={page >= totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6 text-sm text-gray-600">Tip: Use Export CSV to download results for offline analysis.</div>
            </div>
        </div>
    );
}
