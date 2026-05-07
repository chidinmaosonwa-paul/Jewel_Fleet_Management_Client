import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTickets = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await axiosInstance.get("/tickets");
      setTickets(res.data);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    setError("");
    setSuccess("");
    try {
      await axiosInstance.put(`/tickets/${id}/cancel`);
      setSuccess("Ticket cancelled successfully. A refund has been initiated.");
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ticket");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading your tickets...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>My Tickets</h1>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {tickets.length === 0 ? (
        <p>You have no tickets yet. Book a journey to get started.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Departure</th>
              <th>Seat No.</th>
              <th>Price</th>
              <th>Booked On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.journeyId?.destinationId?.name ?? "—"}</td>
                <td>
                  {ticket.journeyId?.departureTime
                    ? formatDate(ticket.journeyId.departureTime)
                    : "—"}
                </td>
                <td>{ticket.seatNumber}</td>
                <td>₦{ticket.price.toLocaleString()}</td>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>
                  <span className={`badge badge-${ticket.status}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  {ticket.status === "booked" && (
                    <button
                      className="btn-delete"
                      onClick={() => handleCancel(ticket._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tickets;
