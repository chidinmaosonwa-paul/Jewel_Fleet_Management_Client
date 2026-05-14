import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const Drivers = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

   const fetchDrivers = async () => {
    try {
      const res = await axiosInstance.get('/auth/drivers');
      setDrivers(res.data);
    } catch {
      setError('Failed to load drivers');
    }
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const phoneRegex = /^[0-9+\-\s]+$/;
    if (!phoneRegex.test(formData.phone)) {
      return setError("Phone number can only contain digits, +, - and spaces");
    }
    if (formData.phone.replace(/[^0-9]/g, "").length < 7) {
      return setError("Phone number must be at least 7 digits");
    }
    if (formData.phone.replace(/[^0-9]/g, "").length > 15) {
      return setError("Phone number must not exceed 15 digits");
    }
    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        ...formData,
        role: "driver",
      });
      setSuccess(
        `Driver account created successfully for ${formData.firstName} ${formData.lastName}.`,
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.[0] ||
          "Failed to create driver account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Drivers</h1>
      </div>

      <div className="card-form">
        <h2>Create Driver Account</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Create Driver Account"}
          </button>
        </form>
      </div>

       {drivers.length === 0 ? (
        <p style={{ marginTop: '1.5rem' }}>No drivers found.</p>
      ) : (
        <table className="data-table" style={{ marginTop: '1.5rem' }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.firstName}</td>
                <td>{driver.lastName}</td>
                <td>{driver.email}</td>
                <td>{driver.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Drivers;
