import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    setError("");
    try {
      const res = await axiosInstance.get("/auth/users");
      setUsers(res.data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (id, role) => {
    setError("");
    setSuccess("");
    try {
      const res = await axiosInstance.put(`/auth/users/${id}/role`, { role });
      setSuccess(res.data.message);
      fetchUsers();
    } catch {
      setError("Failed to update user role");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <select
                    className="status-select"
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
