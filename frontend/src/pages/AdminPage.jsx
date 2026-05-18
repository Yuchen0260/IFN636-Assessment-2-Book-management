import { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";

const AdminPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/auth/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(response.data);
    } catch (error) {
      alert("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axiosInstance.put(
        `/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: response.data.role } : u)));
    } catch (error) {
      alert("Failed to update role.");
    }
  };

    useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin — User Management</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Current Role</th>
              <th className="p-3 border">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-3 border">{u.name}</td>
                <td className="p-3 border">{u.email}</td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 border">
                  {u._id === user.id ? (
                    <span className="text-gray-400 text-sm">You</span>
                  ) : u.role === "customer" ? (
                    <button
                      onClick={() => handleRoleChange(u._id, "admin")}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-800"
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoleChange(u._id, "customer")}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Remove Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
