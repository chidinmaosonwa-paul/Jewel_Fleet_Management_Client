import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async (currentPage = 1) => {
    setError("");
    try {
      const res = await axiosInstance.get(
        `/tickets?page=${currentPage}&limit=10`,
      );
      setTickets(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(page);
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    try {
      await axiosInstance.put(`/tickets/${id}/cancel`);
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

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Tickets</h1>
      </div>

      {error && <p className="error">{error}</p>}

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Email</th>
              <th>Destination</th>
              <th>Seat No.</th>
              <th>Price</th>
              <th>Booked On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>
                  {ticket.userId?.firstName} {ticket.userId?.lastName}
                </td>
                <td>{ticket.userId?.email}</td>
                <td>{ticket.journeyId?.destinationId?.name ?? "—"}</td>
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

export default Tickets;
