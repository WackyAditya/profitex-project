import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Expenses = () => {

  const [expenses, setExpenses] = useState([]);
  const [summaries, setSummaries] = useState({ byCategory: {}, byMonth: {} });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Rent"
  });

  const categories = ["Rent", "Salary", "Utilities", "Transport", "Office Supplies", "Marketing", "Other"];

  const fetchData = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
      const summaryRes = await API.get("/expenses/summary");
      setSummaries(summaryRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await API.put(`/expenses/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await API.post("/expenses", form);
      }
      setForm({ title: "", amount: "", category: "Rent" });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (exp) => {
    setForm({ title: exp.title, amount: exp.amount, category: exp.category });
    setIsEditing(true);
    setEditId(exp._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
      await API.delete(`/expenses/${id}`);
      fetchData();
    }
  };

  return (
    <Layout>
      <div className="page-title">Expenses</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
        {/* CATEGORY SUMMARY */}
        <div className="invoice-card" style={{ marginBottom: 0 }}>
          <h3>Category Breakdown</h3>
          <div style={{ marginTop: "15px" }}>
            {Object.entries(summaries.byCategory).map(([cat, val]) => (
              <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                <span>{cat}</span>
                <span style={{ fontWeight: "600" }}>₹ {val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MONTHLY SUMMARY */}
        <div className="invoice-card" style={{ marginBottom: 0 }}>
          <h3>Monthly Summary</h3>
          <div style={{ marginTop: "15px" }}>
            {Object.entries(summaries.byMonth).map(([month, val]) => (
              <div key={month} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                <span>{month}</span>
                <span style={{ fontWeight: "600" }}>₹ {val.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="invoice-card">
        <h3>{isEditing ? "Edit Expense" : "Add New Expense"}</h3>
        <form onSubmit={submit} style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
          <input
            placeholder="Expense Title"
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ flex: 2, minWidth: "200px" }}
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            required
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            style={{ flex: 1, minWidth: "120px" }}
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ padding: "10px", borderRadius: "10px", border: "1px solid #e2e8f0", flex: 1, minWidth: "150px" }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-primary">{isEditing ? "Update" : "Add Expense"}</button>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setForm({ title: "", amount: "", category: "Rent" });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="invoice-card" style={{ marginTop: "20px", padding: 0, overflow: "hidden" }}>
        <table className="table" style={{ marginTop: 0 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp._id}>
                <td>{exp.title}</td>
                <td><span style={{ padding: "4px 8px", background: "#f1f5f9", borderRadius: "6px", fontSize: "12px" }}>{exp.category}</span></td>
                <td style={{ fontWeight: "600" }}>₹ {exp.amount.toFixed(2)}</td>
                <td>{new Date(exp.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(exp)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: "10px" }}>Edit</button>
                  <button onClick={() => handleDelete(exp._id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Expenses;
