import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    distance: "",
    baseFare: "",
  });
  const [editId, setEditId] = useState(null);

  const fetchDestinations = async () => {
    setError("");
    try {
      const res = await axiosInstance.get("/destinations");
      setDestinations(res.data);
    } catch {
      setError("Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/destinations/${editId}`, formData);
      } else {
        await axiosInstance.post("/destinations", formData);
      }
      setFormData({ name: "", distance: "", baseFare: "" });
      setEditId(null);
      setShowForm(false);
      fetchDestinations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.[0] ||
          "Failed to save destination",
      );
    }
  };

  const handleEdit = (destination) => {
    setFormData({
      name: destination.name,
      distance: destination.distance,
      baseFare: destination.baseFare,
    });
    setEditId(destination._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?"))
      return;
    try {
      await axiosInstance.delete(`/destinations/${id}`);
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete destination");
    }
  };

  if (loading) return <p>Loading destinations...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Destinations</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({ name: "", distance: "", baseFare: "" });
          }}
        >
          {showForm ? "Cancel" : "+ Add Destination"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Edit Destination" : "Add New Destination"}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Abuja"
                required
              />
            </div>
            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g. 750"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Base Fare (₦)</label>
            <input
              type="number"
              name="baseFare"
              value={formData.baseFare}
              onChange={handleChange}
              placeholder="e.g. 8000"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            {editId ? "Update Destination" : "Add Destination"}
          </button>
        </form>
      )}

      {destinations.length === 0 ? (
        <p>No destinations found. Add one to get started.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Distance</th>
              <th>Base Fare</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination._id}>
                <td>{destination.name}</td>
                <td>{destination.distance} km</td>
                <td>₦{destination.baseFare.toLocaleString()}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(destination)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(destination._id)}
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

export default Destinations;
