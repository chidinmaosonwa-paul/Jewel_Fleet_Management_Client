import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const Financial = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get('/financial/transactions');
      setTransactions(res.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setReportLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/financial/report', {
        params: dateRange,
      });
      setReport(res.data);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setReportLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString('en-GB', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Financial</h1>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Financial Report */}
      <div className="card-form">
        <h2>Generate Financial Report</h2>
        <form onSubmit={handleGenerateReport}>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} required />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} required />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={reportLoading}>
            {reportLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </form>

        {report && (
          <div className="report-summary">
            <div className="summary-card">
              <p>Total Revenue</p>
              <h3>₦{report.revenue.toLocaleString()}</h3>
            </div>
            <div className="summary-card">
              <p>Total Expenses</p>
              <h3>₦{report.expenses.toLocaleString()}</h3>
            </div>
            <div className="summary-card">
              <p>Net Profit</p>
              <h3 style={{ color: report.netProfit >= 0 ? '#2d6a4f' : '#c1121f' }}>
                ₦{report.netProfit.toLocaleString()}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="page-header" style={{ marginTop: '2rem' }}>
        <h2>All Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Passenger</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.userId?.firstName} {tx.userId?.lastName}</td>
                <td>{tx.userId?.email}</td>
                <td>₦{tx.amount.toLocaleString()}</td>
                <td>
                  <span className={`badge ${tx.type === 'purchase' ? 'badge-active' : 'badge-retired'}`}>
                    {tx.type}
                  </span>
                </td>
                <td>{formatDate(tx.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Financial;