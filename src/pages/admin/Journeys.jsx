import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    destinationId: "",
    departureTime: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchAll = async () => {
    setError("");
    try {
      const [journeysRes, vehiclesRes, destinationsRes] = await Promise.all([
        axiosInstance.get("/journeys"),
        axiosInstance.get("/fleet"),
        axiosInstance.get("/destinations"),
      ]);
      setJourneys(journeysRes.data);
      setVehicles(vehiclesRes.data);
      setDestinations(destinationsRes.data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axiosInstance.put(`/journeys/${editId}`, formData);
      } else {
        await axiosInstance.post("/journeys", formData);
      }
      setFormData({ vehicleId: "", destinationId: "", departureTime: "" });
      setEditId(null);
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.[0] ||
          "Failed to save journey",
      );
    }
  };

  const handleEdit = (journey) => {
    setFormData({
      vehicleId: journey.vehicleId?._id || journey.vehicleId,
      destinationId: journey.destinationId?._id || journey.destinationId,
      departureTime: new Date(journey.departureTime).toISOString().slice(0, 16),
    });
    setEditId(journey._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journey?"))
      return;
    try {
      await axiosInstance.delete(`/journeys/${id}`);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete journey");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosInstance.put(`/journeys/${id}/status`, { status });
      fetchAll();
    } catch {
      setError("Failed to update status");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading journeys...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Journeys</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({
              vehicleId: "",
              destinationId: "",
              departureTime: "",
            });
          }}
        >
          {showForm ? "Cancel" : "+ Schedule Journey"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Journey" : "Schedule New Journey"}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle</label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.plateNumber} — {v.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Destination</label>
              <select
                name="destinationId"
                value={formData.destinationId}
                onChange={handleChange}
                required
              >
                <option value="">Select a destination</option>
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} — ₦{d.baseFare.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editId ? "Update Journey" : "Schedule Journey"}
          </button>
        </form>
      )}

      {journeys.length === 0 ? (
        <p>No journeys found. Schedule one to get started.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Vehicle</th>
              <th>Departure</th>
              <th>Available Seats</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => (
              <tr key={journey._id}>
                <td>{journey.destinationId?.name ?? "—"}</td>
                <td>{journey.vehicleId?.plateNumber ?? "—"}</td>
                <td>{formatDate(journey.departureTime)}</td>
                <td>{journey.availableSeats}</td>
                <td>
                  <select
                    className="status-select"
                    value={journey.status}
                    onChange={(e) =>
                      handleStatusChange(journey._id, e.target.value)
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(journey)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(journey._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Journeys;
