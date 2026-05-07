import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    journeyId: "",
    journeyDuration: "",
    fuelConsumption: "",
    issuesReported: "",
    passengerFeedback: "",
  });

  const fetchAll = async () => {
    setError("");
    setSuccess("");
    try {
      const [reportsRes, journeysRes] = await Promise.all([
        axiosInstance.get("/reports"),
        axiosInstance.get("/journeys"),
      ]);
      setReports(reportsRes.data);
      // Drivers only see completed and in_progress journeys
      setJourneys(
        journeysRes.data.filter((j) =>
          ["in_progress", "completed"].includes(j.status),
        ),
      );
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
    setSuccess("");
    try {
      const dataToSend = {
        ...formData,
        journeyDuration: Number(formData.journeyDuration),
        fuelConsumption: formData.fuelConsumption
          ? Number(formData.fuelConsumption)
          : undefined,
        passengerFeedback: formData.passengerFeedback
          ? formData.passengerFeedback.split(",").map((f) => f.trim())
          : [],
      };
      await axiosInstance.post("/reports", dataToSend);
      setSuccess("Report submitted successfully!");
      setFormData({
        journeyId: "",
        journeyDuration: "",
        fuelConsumption: "",
        issuesReported: "",
        passengerFeedback: "",
      });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error?.[0] ||
          "Failed to submit report",
      );
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading reports...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>My Reports</h1>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "Cancel" : "+ Submit Report"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {showForm && (
        <form className="card-form" onSubmit={handleSubmit}>
          <h2>Submit Journey Report</h2>
          {journeys.length === 0 ? (
            <p>
              No journeys available to report on. Only in-progress or completed
              journeys can be reported.
            </p>
          ) : (
            <>
              <div className="form-group">
                <label>Journey</label>
                <select
                  name="journeyId"
                  value={formData.journeyId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a journey</option>
                  {journeys.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.destinationId?.name ?? "—"} —{" "}
                      {formatDate(j.departureTime)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Journey Duration (hours)</label>
                  <input
                    type="number"
                    name="journeyDuration"
                    value={formData.journeyDuration}
                    onChange={handleChange}
                    placeholder="e.g. 8"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fuel Consumption (litres)</label>
                  <input
                    type="number"
                    name="fuelConsumption"
                    value={formData.fuelConsumption}
                    onChange={handleChange}
                    placeholder="e.g. 45"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Issues Reported</label>
                <input
                  type="text"
                  name="issuesReported"
                  value={formData.issuesReported}
                  onChange={handleChange}
                  placeholder="e.g. None"
                />
              </div>
              <div className="form-group">
                <label>
                  Passenger Feedback{" "}
                  <span style={{ fontWeight: "normal", fontSize: "0.8rem" }}>
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  name="passengerFeedback"
                  value={formData.passengerFeedback}
                  onChange={handleChange}
                  placeholder="e.g. Great ride, Very comfortable"
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Report
              </button>
            </>
          )}
        </form>
      )}

      {reports.length === 0 ? (
        <p>You have not submitted any reports yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Journey</th>
              <th>Duration</th>
              <th>Fuel</th>
              <th>Issues</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.journeyId?.destinationId?.name ?? "—"}</td>
                <td>{report.journeyDuration} hrs</td>
                <td>
                  {report.fuelConsumption ? `${report.fuelConsumption}L` : "—"}
                </td>
                <td>{report.issuesReported || "—"}</td>
                <td>{formatDate(report.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
