import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";
import { getAllUsers, getUsersByRole } from "../api/user";

export default function UserListPage() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState(location.state?.message || "");

    const { role } = useParams(); // ADMIN, PANELIST, CANDIDATE

    useEffect(() => {
        if (!role || role.toUpperCase() === "ADMIN") {
            fetchUsers(page);
        } else {
            fetchUsers(page);
        }
    }, [role, page]);


    useEffect(() => {
        if (location.state?.message || location.state?.refresh) {
            fetchUsers(page);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const fetchUsers = async (pageNo = 0) => {
        setLoading(true);
        try {
            let data;
            if (!role || role === "undefined"|| role.toUpperCase() === "ADMIN") {
                data = await getAllUsers(pageNo, 10);
            } else {
                data = await getUsersByRole(role.toUpperCase(), pageNo, 10);
            }

            setUsers(data.content || []);
            setTotalPages(data.totalPages || 1);
            setPage(data.number || 0);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };


    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) fetchUsers(newPage);
    };

    const ROLE_TITLES = {
        ADMIN: "Users",
        HR: "HR Users",
        PANEL: "Panelists",
        CANDIDATE: "Candidates",
    };

    const canAdd = ["ADMIN", "CANDIDATE", "PANEL"].includes(role?.toUpperCase());

    const handleAdd = () => {
        if (role?.toUpperCase() === "ADMIN") navigate("/admin/users/new");
        else navigate(`/users/role/${role}/new`);
    };

    const handleEdit = (id) => {
        if (role?.toUpperCase() === "ADMIN") navigate(`/admin/users/${id}/edit`);
        else navigate(`/users/role/${role}/${id}/edit`);
    };

    return (
        <>
            <Navbar />
            <DashboardContainer title={ROLE_TITLES[role?.toUpperCase()] || "User Management"}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{ROLE_TITLES[role?.toUpperCase()] || "Users"}</h2>

                    {canAdd && (
                        <button
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-sky-600"
                            onClick={handleAdd}
                        >
                            + Add {ROLE_TITLES[role?.toUpperCase()]?.slice(0, -1) || "User"}
                        </button>
                    )}
                </div>

                {successMessage && (
                    <div className="mb-4 bg-green-100 text-green-800 border border-green-400 px-4 py-3 rounded relative shadow-sm animate-fade-in-down">
                        {successMessage}
                    </div>
                )}

                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    <>
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Name</th>
                                    <th className="p-2 border">User Name</th>
                                    <th className="p-2 border">Phone</th>
                                    <th className="p-2 border">Email</th>
                                    <th className="p-2 border">Role</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <tr key={user.userId} className="hover:bg-sky-50">
                                            <td className="border p-2">{page * 10 + (index + 1)}</td>
                                            <td className="border p-2">{user.fullName}</td>
                                            <td className="border p-2">{user.userName}</td>
                                            <td className="border p-2">{user.userPhone}</td>
                                            <td className="border p-2">{user.email}</td>
                                            <td className="border p-2">{user.roleName}</td>
                                            <td className="border p-2 text-center">
                                                {user.active ? (
                                                    <span className="text-green-600 font-medium">Active</span>
                                                ) : (
                                                    <span className="text-red-500 font-medium">Inactive</span>
                                                )}
                                            </td>
                                            <td className="border p-2 text-center">
                                                <button
                                                    className="bg-sky-500 text-white px-2 py-1 rounded mr-2 hover:bg-sky-600"
                                                    onClick={() => handleEdit(user.userId)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded mr-2 hover:bg-sky-600"
                                                    onClick={() => alert("Delete functionality not implemented yet")}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-4 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <p>
                                Page {page + 1} of {totalPages}
                            </p>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page + 1 >= totalPages}
                                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </DashboardContainer>
        </>
    );
}
