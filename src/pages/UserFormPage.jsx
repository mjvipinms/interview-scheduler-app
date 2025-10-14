import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardContainer from "../components/DashboardContainer";
import { getUserById, updateUser, addUser } from "../api/user";
import { fetchRoles } from "../api/role";

export default function UserFormPage() {
    const { id, role } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        userPhone: "",
        fullName: "",
        password: "",
        roleId: "",
        active: true,
    });
    const [roles, setRoles] = useState([]);
    const getRoleDisplayName = () => {
        if (!role) return "User";
        const r = role.toUpperCase();
        if (r === "ADMIN") return "User";
        if (r === "PANEL") return "Panelist";
        if (r === "CANDIDATE") return "Candidate";
        return "User";
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                const rolesData = await fetchRoles();
                setRoles(Array.isArray(rolesData) ? rolesData : []);

                if (isEdit) {
                    const data = await getUserById(id);
                    setFormData(data);
                } else if (role && role.toUpperCase() !== "ADMIN") {
                    // Auto-select role for Candidate or Panelist
                    const matched = rolesData.find(
                        (r) => r.roleName.toUpperCase() === role.toUpperCase()
                    );
                    if (matched) setFormData((prev) => ({ ...prev, roleId: matched.roleId }));
                }
            } catch (err) {
                console.error("Error loading roles or user:", err);
                setRoles([]);
            }
        };
        loadData();
    }, [id, role]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) await updateUser(id, formData);
            else await addUser(formData);

            const redirectPath =
                role?.toUpperCase() === "ADMIN"
                    ? "/admin/users"
                    : `/users/role/${role}`;
            navigate(redirectPath, {
                state: { message: isEdit ? "User updated successfully" : "User added successfully" },
            });
        } catch (err) {
            console.error("Error saving user:", err);
            alert("Failed to save user");
        }
    };
    const displayName = getRoleDisplayName();
    const pageTitle = isEdit
        ? `Edit ${displayName}`
        : `Add ${displayName}`;


    return (
        <>
            <Navbar />
            <DashboardContainer title={pageTitle}>
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-md w-full max-w-6xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block mb-1 font-medium">Full Name</label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">User Name</label>
                            <input
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Password</label>
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required={!isEdit}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Phone</label>
                            <input
                                name="userPhone"
                                value={formData.userPhone}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                                maxLength={10}
                                pattern="\d{10}"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-700">Role</label>
                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                required
                                disabled={role && role.toUpperCase() !== "ADMIN"} // HR can't change auto role
                            >
                                <option value="">Select Role</option>
                                {roles.map((r) => (
                                    <option key={r.roleId} value={r.roleId}>
                                        {r.roleName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
                            <label>Active</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (!role) {
                                    navigate("/admin/users", { state: { refresh: true } });
                                } else {
                                    navigate(`/users/role/${role}`, { state: { refresh: true } });
                                }
                            }}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-sky-600"
                        >
                            {isEdit ? `Update ${displayName}` : `Add ${displayName}`}
                        </button>

                    </div>
                </form>
            </DashboardContainer>
        </>
    );
}
