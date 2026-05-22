import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    capacity: "",
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicles = async (currentPage = 1) => {
    setError("");
    try {
      const res = await axiosInstance.get(
        `/fleet?page=${currentPage}&limit=10`,
      );
      setVehicles(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      setError("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(page);
  }, [page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/fleet/${editId}`, formData);
      } else {
        await axiosInstance.post("/fleet", formData);
      }
      setFormData({
        plateNumber: "",
        model: "",
        capacity: "",
        status: "active",
      });
      setEditId(null);
      setShowForm(false);
      fetchVehicles();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.[0] ||
          "Failed to save vehicle",
      );
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      plateNumber: vehicle.plateNumber,
      model: vehicle.model,
      capacity: vehicle.capacity,
      status: vehicle.status,
    });
    setEditId(vehicle._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await axiosInstance.delete(`/fleet/${id}`);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Vehicles</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({
              plateNumber: "",
              model: "",
              capacity: "",
              status: "active",
            });
          }}
        >
          {showForm ? "Cancel" : "+ Add Vehicle"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Vehicle" : "Add New Vehicle"}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Plate Number</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                placeholder="e.g. LAG-123-XY"
                required
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Toyota Coaster"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g. 15"
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="in_maintenance">In Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">
            {editId ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>
      )}

      {vehicles.length === 0 ? (
        <p>No vehicles found. Add one to get started.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.plateNumber}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.capacity}</td>
                <td>
                  <span className={`badge badge-${vehicle.status}`}>
                    {vehicle.status.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(vehicle)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(vehicle._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn-ghost"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-ghost"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
