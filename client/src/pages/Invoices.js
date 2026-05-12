import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Invoices = () => {

  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchInvoices();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data } = await API.get("/invoices");
      setInvoices(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addItem = () => {
    setItems([...items, {
      productId: "",
      quantity: 1,
      price: 0,
      gst: 0,
      total: 0
    }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "productId") {
      const selected = products.find(p => p._id === value);
      if (selected) {
        updated[index].price = selected.price;
        updated[index].gst = selected.gst || 0;
      }
    }

    const subtotal = updated[index].quantity * updated[index].price;
    const gstAmount = subtotal * (updated[index].gst / 100);

    updated[index].total = subtotal + gstAmount;

    setItems(updated);
  };

  const grandTotal = items.reduce((sum, i) => sum + i.total, 0);

  const createInvoice = async () => {
    if (!customerName || items.length === 0) {
      alert("Please enter customer name and add at least one item.");
      return;
    }

    try {
      await API.post("/invoices", {
        customerName,
        customerPhone,
        customerEmail,
        items,
        grandTotal
      });

      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setItems([]);

      fetchInvoices();
      alert("Invoice generated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate invoice");
    }
  };

  const downloadPDF = async (id, invNumber) => {
    try {
      const response = await API.get(`/invoices/download/${id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF");
    }
  };

  return (
    <Layout>

      <h2>Create Invoice</h2>

      <div className="invoice-card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="Customer Name"
            value={customerName}
            required
            onChange={(e) => setCustomerName(e.target.value)}
            style={{ width: "100%" }}
          />
          <input
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            style={{ width: "100%" }}
          />
          <input
            placeholder="Email Address"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <button className="btn-secondary" onClick={addItem}>
          + Add Product
        </button>

        {items.map((item, index) => (
          <div key={index} style={{
            marginTop: "15px",
            padding: "15px",
            background: "#f8fafc",
            borderRadius: "10px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
            alignItems: "center",
            gap: "10px"
          }}>

            <select
              value={item.productId}
              onChange={(e) => updateItem(index, "productId", e.target.value)}
              style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.quantity})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
              style={{ width: "70px", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />

            <span style={{ fontSize: "14px" }}>₹ {item.price}</span>
            <span style={{ fontSize: "14px" }}>{item.gst}% GST</span>
            <span style={{ fontSize: "14px", fontWeight: "600" }}>₹ {item.total.toFixed(2)}</span>

            <button
              onClick={() => removeItem(index)}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "20px" }}
              title="Remove Item"
            >
              &times;
            </button>
          </div>
        ))}

        {items.length > 0 && (
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <h3 style={{ fontSize: "22px" }}>Grand Total: <span style={{ color: "#2563eb" }}>₹ {grandTotal.toFixed(2)}</span></h3>
            <button className="btn-primary" onClick={createInvoice} style={{ marginTop: "15px" }}>
              Generate & Save Invoice
            </button>
          </div>
        )}

      </div>

      <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Recent Invoices</h3>

      <div className="invoice-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table" style={{ marginTop: 0 }}>
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(i => (
              <tr key={i._id}>
                <td>{i.invoiceNumber}</td>
                <td>{i.customerName}</td>
                <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                <td style={{ fontWeight: "600" }}>₹ {i.grandTotal.toFixed(2)}</td>
                <td>
                  <button
                    className="btn-secondary"
                    style={{ padding: "4px 10px", fontSize: "13px" }}
                    onClick={() => downloadPDF(i._id, i.invoiceNumber)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </Layout>
  );
};

export default Invoices;