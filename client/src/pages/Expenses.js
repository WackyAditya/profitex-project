import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Expenses = () => {

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const fetchExpenses = async () => {
    const res = await API.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (e) => {
    e.preventDefault();
    await API.post("/expenses", form);
    fetchExpenses();
  };

  return (
    <Layout>
      <div className="page-title">Expenses</div>

      <div className="invoice-card">
        <form onSubmit={addExpense} className="expense-form">
          <input
            placeholder="Expense Title"
            onChange={(e)=>setForm({...form,title:e.target.value})}
          />

          <input
            type="number"
            placeholder="Amount"
            onChange={(e)=>setForm({...form,amount:Number(e.target.value)})}
          />

          <input
            placeholder="Category"
            onChange={(e)=>setForm({...form,category:e.target.value})}
          />

          <button className="btn-primary">Add Expense</button>
        </form>
      </div>

      <div className="invoice-card" style={{marginTop:"20px"}}>
        {expenses.map(exp => (
          <div key={exp._id} style={{padding:"8px 0", borderBottom:"1px solid #eee"}}>
            {exp.title} — ₹{exp.amount} ({exp.category})
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Expenses;
