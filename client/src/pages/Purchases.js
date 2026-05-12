import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Purchases = () => {

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);

  const addItem = () => {
    setItems([
      ...items,
      { productName: "", quantity: 1, cost: 0 }
    ]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const fetchPurchases = async () => {
    try {
      const res = await API.get("/purchases");
      setPurchaseList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const createPurchase = async () => {
    if (!supplier || items.length === 0) {
      alert("Please fill supplier name and add at least one item.");
      return;
    }

    try {
      await API.post("/purchases", {
        supplier,
        items
      });

      setSupplier("");
      setItems([]);
      fetchPurchases();
      alert("Purchase recorded successfully! Inventory updated.");
    } catch (err) {
      alert("Failed to record purchase.");
    }
  };

  return (
    <Layout>

      <h2 style={{ marginBottom: "20px" }}>Create Purchase</h2>

      <div className="invoice-card">

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
          <input
            placeholder="Supplier Name"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            style={{ width: "300px", marginBottom: 0 }}
          />
          <button className="btn-secondary" onClick={addItem}>
            + Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} style={{
            marginTop: "10px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: "10px",
            alignItems: "center",
            padding: "10px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}>
            <input
              placeholder="Product Name"
              value={item.productName}
              onChange={(e) => updateItem(index, "productName", e.target.value)}
              style={{ marginBottom: 0 }}
            />
            <input
              type="number"
              placeholder="Qty"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
              style={{ marginBottom: 0 }}
            />
            <input
              type="number"
              placeholder="Cost Price"
              value={item.cost}
              onChange={(e) => updateItem(index, "cost", Number(e.target.value))}
              style={{ marginBottom: 0 }}
            />
            <button
              onClick={() => removeItem(index)}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "18px" }}
            >
              &times;
            </button>
          </div>
        ))}

        {items.length > 0 && (
          <button className="btn-primary" onClick={createPurchase} style={{ marginTop: "20px" }}>
            Save Purchase & Update Stock
          </button>
        )}

      </div>

      <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Purchase History</h3>

      <div className="invoice-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table" style={{ marginTop: 0 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier</th>
              <th>Items</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {purchaseList.map(p => (
              <tr key={p._id}>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>{p.supplier}</td>
                <td>
                  <ul style={{ paddingLeft: "15px", fontSize: "13px" }}>
                    {p.items.map((it, idx) => (
                      <li key={idx}>{it.productName} (x{it.quantity})</li>
                    ))}
                  </ul>
                </td>
                <td style={{ fontWeight: "600" }}>₹ {p.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
};

export default Purchases;
