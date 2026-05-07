import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Journeys = () => {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({
    gender: "",
    occupation: "",
    nextOfKinName: "",
    nextOfKinPhone: "",
    nextOfKinRelationship: "",
  });

  const fetchJourneys = async () => {
    setError("");
    setSuccess("");
    try {
      const res = await axiosInstance.get("/journeys");
      setJourneys(res.data.filter((j) => j.status === "scheduled"));
    } catch {
      setError("Failed to load journeys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleChange = (e) => {
    setPassengerDetails({
      ...passengerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectJourney = (journey) => {
    setSelectedJourney(journey);
    setError("");
    setSuccess("");
    setPassengerDetails({
      gender: "",
      occupation: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      nextOfKinRelationship: "",
    });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError("");
    setSuccess("");
    try {
      await axiosInstance.post("/tickets/book", {
        journeyId: selectedJourney._id,
        passengerDetails,
      });
      setSuccess("Ticket booked successfully!");
      setSelectedJourney(null);
      fetchJourneys();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book ticket");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading available journeys...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Available Journeys</h1>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Booking Form */}
      {selectedJourney && (
        <div className="card-form">
          <div className="page-header">
            <h2>Book Ticket — {selectedJourney.destinationId?.name}</h2>
            <button
              className="btn-delete"
              onClick={() => setSelectedJourney(null)}
            >
              ✕ Cancel
            </button>
          </div>
          <p
            style={{ marginBottom: "1rem", color: "#555", fontSize: "0.9rem" }}
          >
            Departure: {formatDate(selectedJourney.departureTime)} &nbsp;|&nbsp;
            Price: ₦{selectedJourney.destinationId?.baseFare?.toLocaleString()}
          </p>
          <form onSubmit={handleBook}>
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={passengerDetails.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={passengerDetails.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Engineer"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Next of Kin Name</label>
                <input
                  type="text"
                  name="nextOfKinName"
                  value={passengerDetails.nextOfKinName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Next of Kin Phone</label>
                <input
                  type="tel"
                  name="nextOfKinPhone"
                  value={passengerDetails.nextOfKinPhone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Next of Kin Relationship</label>
              <input
                type="text"
                name="nextOfKinRelationship"
                value={passengerDetails.nextOfKinRelationship}
                onChange={handleChange}
                placeholder="e.g. Mother, Brother"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      )}

      {/* Journeys Table */}
      {journeys.length === 0 ? (
        <p>No journeys available at the moment.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Distance</th>
              <th>Departure</th>
              <th>Available Seats</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {journeys.map((journey) => (
              <tr key={journey._id}>
                <td>{journey.destinationId?.name ?? "—"}</td>
                <td>{journey.destinationId?.distance ?? "—"} km</td>
                <td>{formatDate(journey.departureTime)}</td>
                <td>{journey.availableSeats}</td>
                <td>
                  ₦{journey.destinationId?.baseFare?.toLocaleString() ?? "—"}
                </td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => handleSelectJourney(journey)}
                    disabled={journey.availableSeats === 0 || !!selectedJourney}
                  >
                    {journey.availableSeats === 0 ? "Full" : "Book"}
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
