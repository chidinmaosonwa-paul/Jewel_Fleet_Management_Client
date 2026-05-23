import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setError("");
    try {
      const [vehicles, destinations, journeys, tickets, transactions] =
        await Promise.all([
          axiosInstance.get("/fleet?page=1&limit=1000"),
          axiosInstance.get("/destinations?page=1&limit=1000"),
          axiosInstance.get("/journeys?page=1&limit=1000"),
          axiosInstance.get("/tickets?page=1&limit=1000"),
          axiosInstance.get("/financial/transactions?page=1&limit=1000"),
        ]);

      const vehiclesData = vehicles.data.data;
      const destinationsData = destinations.data.data;
      const journeysData = journeys.data.data;
      const ticketsData = tickets.data.data;
      const transactionsData = transactions.data.data;

      const totalRevenue = transactionsData
        .filter((t) => t.type === "purchase")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalRefunds = transactionsData
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        vehicles: vehiclesData.length,
        activeVehicles: vehiclesData.filter((v) => v.status === "active")
          .length,
        destinations: destinationsData.length,
        journeys: journeysData.length,
        scheduledJourneys: journeysData.filter((j) => j.status === "scheduled")
          .length,
        tickets: ticketsData.length,
        bookedTickets: ticketsData.filter((t) => t.status === "booked").length,
        totalRevenue,
        totalRefunds,
        netProfit: totalRevenue - totalRefunds,
      });
    } catch {
      setError("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <p>Loading overview...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Overview</h1>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <p>Total Vehicles</p>
          <h2>{stats.vehicles}</h2>
          <span>{stats.activeVehicles} active</span>
        </div>
        <div className="overview-card">
          <p>Destinations</p>
          <h2>{stats.destinations}</h2>
          <span>available routes</span>
        </div>
        <div className="overview-card">
          <p>Total Journeys</p>
          <h2>{stats.journeys}</h2>
          <span>{stats.scheduledJourneys} scheduled</span>
        </div>
        <div className="overview-card">
          <p>Total Tickets</p>
          <h2>{stats.tickets}</h2>
          <span>{stats.bookedTickets} booked</span>
        </div>
        <div className="overview-card green">
          <p>Total Revenue</p>
          <h2>₦{stats.totalRevenue.toLocaleString()}</h2>
          <span>all time</span>
        </div>
        <div className="overview-card red">
          <p>Total Refunds</p>
          <h2>₦{stats.totalRefunds.toLocaleString()}</h2>
          <span>all time</span>
        </div>
        <div className="overview-card blue">
          <p>Net Profit</p>
          <h2>₦{stats.netProfit.toLocaleString()}</h2>
          <span>all time</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
