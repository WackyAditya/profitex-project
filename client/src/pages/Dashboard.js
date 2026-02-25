import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Dashboard = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return (
      <Layout>
        <h2>Loading...</h2>
      </Layout>
    );
  }

  return (
    <Layout>

      <h2 style={{ marginBottom: "20px" }}>
        Business Overview
      </h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h4>Total Sales</h4>
          <h2>₹ {data.totalSales}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Expenses</h4>
          <h2>₹ {data.totalExpenses}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Purchases</h4>
          <h2>₹ {data.totalPurchaseCost}</h2>
        </div>

        <div className="stat-card highlight">
          <h4>Net Profit</h4>
          <h2>₹ {data.profit}</h2>
        </div>

      </div>

    </Layout>
  );
};

export default Dashboard;
