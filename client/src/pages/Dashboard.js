import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const Dashboard = () => {

  const [summary, setSummary] = useState({
    sales: 0,
    expenses: 0,
    purchases: 0,
    profit: 0,
    topProducts: [],
    trends: []
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setSummary(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSummary();
  }, []);

  const barData = {
    labels: ["Sales", "Expenses", "Purchases"],
    datasets: [
      {
        label: "Current Total",
        data: [summary.sales, summary.expenses, summary.purchases],
        backgroundColor: ["#2563eb", "#ef4444", "#10b981"],
        borderRadius: 6,
      },
    ],
  };

  const lineData = {
    labels: summary.trends.map(t => t.month),
    datasets: [
      {
        label: "Sales",
        data: summary.trends.map(t => t.sales),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Expenses",
        data: summary.trends.map(t => t.expenses),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const pieData = {
    labels: ["Sales", "Expenses"],
    datasets: [
      {
        data: [summary.sales, summary.expenses],
        backgroundColor: ["#2563eb", "#ef4444"],
      },
    ],
  };

  return (
    <Layout>

      <h2 className="dashboard-title">Business Dashboard</h2>

      {/* KPI Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h4>Total Sales</h4>
          <h2 style={{ color: "#2563eb" }}>₹ {summary.sales.toLocaleString()}</h2>
        </div>

        <div className="card">
          <h4>Total Purchases</h4>
          <h2 style={{ color: "#10b981" }}>₹ {summary.purchases.toLocaleString()}</h2>
        </div>

        <div className="card">
          <h4>Total Expenses</h4>
          <h2 style={{ color: "#ef4444" }}>₹ {summary.expenses.toLocaleString()}</h2>
        </div>

        <div className="card highlight">
          <h4>Net Profit</h4>
          <h2>₹ {summary.profit.toLocaleString()}</h2>
        </div>
      </div>

      {/* TRENDS & TOP PRODUCTS */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "25px", marginBottom: "30px" }}>
        <div className="chart-box">
          <h3>Monthly Trends (Sales vs Expenses)</h3>
          <div style={{ height: "300px" }}>
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-box">
          <h3>Top Selling Products</h3>
          <table className="table" style={{ marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Sold</th>
              </tr>
            </thead>
            <tbody>
              {summary.topProducts.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td style={{ fontWeight: "600" }}>{p.qty}</td>
                </tr>
              ))}
              {summary.topProducts.length === 0 && (
                <tr><td colSpan="2" style={{ textAlign: "center", padding: "20px" }}>No sales yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-box">
          <h3>Budget Overview</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-box">
          <h3>Sales vs Expenses Ratio</h3>
          <Pie data={pieData} />
        </div>
      </div>

    </Layout>
  );
};

export default Dashboard;