import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Invoices = () => {

  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const addItem = () => {
    setItems([
      ...items,
      { productName: "", quantity: 1, price: 0, gst: 0 }
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const fetchInvoices = async () => {
    const res = await API.get("/invoices");
    setInvoices(res.data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const createInvoice = async () => {

    if (!customerName || items.length === 0) {
      alert("Fill all fields");
      return;
    }

    await API.post("/invoices", {
      customerName,
      items
    });

    setCustomerName("");
    setItems([]);
    fetchInvoices();
  };

  const total = items.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);

  return (
    <Layout>

      <h2 style={{ marginBottom: "20px" }}>
        Create Invoice
      </h2>

      <div className="invoice-card">

        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
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
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                updateItem(index, "price", Number(e.target.value))
              }
            />
          </div>
        ))}

        <h3 style={{ marginTop: "15px" }}>
          Grand Total: ₹ {total}
        </h3>

        <button className="btn-primary" onClick={createInvoice}>
          Generate Invoice
        </button>

      </div>

      <h3 style={{ marginTop: "30px" }}>
        Previous Invoices
      </h3>

      {invoices.map(inv => (
        <div key={inv._id} className="invoice-card">
          {inv.invoiceNumber} — ₹{inv.grandTotal}
        </div>
      ))}

    </Layout>
  );
};

export default Invoices;
