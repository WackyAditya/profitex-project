import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Products = () => {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    gst: "",
    supplier: ""
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await API.put(`/products/${editId}`, form);
        setIsEditing(false);
        setEditId(null);
      } else {
        await API.post("/products", form);
      }

      setForm({
        name: "",
        category: "",
        quantity: "",
        price: "",
        gst: "",
        supplier: ""
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      category: p.category || "",
      quantity: p.quantity,
      price: p.price,
      gst: p.gst || 0,
      supplier: p.supplier || ""
    });
    setIsEditing(true);
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const lowStockCount = products.filter(p => p.quantity < 5).length;

  return (
    <Layout>

      <h2 style={{ marginBottom: "20px" }}>Products</h2>

      {/* LOW STOCK ALERT */}
      {lowStockCount > 0 && (
        <div style={{
          background: "#fee2e2",
          color: "#b91c1c",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          fontWeight: "600",
          border: "1px solid #fecaca"
        }}>
          ⚠️ Alert: {lowStockCount} products are low on stock (Quantity &lt; 5).
        </div>
      )}

      {/* ADD/EDIT PRODUCT FORM */}

      <div className="invoice-card">

        <h3>{isEditing ? "Edit Product" : "Add Product"}</h3>

        <form onSubmit={submit}>

          <input
            placeholder="Product Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            required
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            required
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            placeholder="GST %"
            value={form.gst}
            onChange={(e) => setForm({ ...form, gst: e.target.value })}
          />

          <input
            placeholder="Supplier"
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn-primary">{isEditing ? "Update Product" : "Add Product"}</button>
            {isEditing && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditId(null);
                  setForm({ name: "", category: "", quantity: "", price: "", gst: "", supplier: "" });
                }}
              >
                Cancel
              </button>
            )}
          </div>

        </form>

      </div>

      {/* PRODUCTS TABLE */}

      <div className="invoice-card">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3>Product Inventory</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              placeholder="Search..."
              className="search-input"
              style={{ width: "200px", marginBottom: 0 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <table className="table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>GST</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.map((p) => (
              <tr key={p._id}>

                <td>{p.name}</td>

                <td>{p.category}</td>

                <td>
                  <span className={p.quantity < 5 ? "low-stock" : "in-stock"}>
                    {p.quantity}
                  </span>
                </td>

                <td>₹ {p.price}</td>

                <td>{p.gst}%</td>

                <td>{p.supplier}</td>

                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: "10px", fontWeight: "600" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "600" }}
                  >
                    Delete
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

export default Products;