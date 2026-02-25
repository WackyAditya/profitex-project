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

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const fetchPurchases = async () => {
    const res = await API.get("/purchases");
    setPurchaseList(res.data);
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const createPurchase = async () => {

    if (!supplier || items.length === 0) {
      alert("Fill all fields");
      return;
    }

    await API.post("/purchases", {
      supplier,
      items
    });

    setSupplier("");
    setItems([]);
    fetchPurchases();
  };

  return (
    <Layout>

      <h2 style={{ marginBottom: "20px" }}>
        Create Purchase
      </h2>

      <div className="invoice-card">

        <input
          placeholder="Supplier Name"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
        />

        <button className="btn-secondary" onClick={addItem}>
          + Add Item
        </button>

        {items.map((item, index) => (
          <div key={index} style={{ marginTop: "10px" }}>
            <input
              placeholder="Product"
              value={item.productName}
              onChange={(e) =>
                updateItem(index, "productName", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Cost"
              value={item.cost}
              onChange={(e) =>
                updateItem(index, "cost", Number(e.target.value))
              }
            />
          </div>
        ))}

        <button className="btn-primary" onClick={createPurchase}>
          Save Purchase
        </button>

      </div>

      <h3 style={{ marginTop: "30px" }}>
        Purchase History
      </h3>

      {purchaseList.map(p => (
        <div key={p._id} className="invoice-card">
          {p.supplier} — ₹{p.totalCost}
        </div>
      ))}

    </Layout>
  );
};

export default Purchases;
