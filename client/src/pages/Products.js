import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });

  const fetchProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    await API.post("/products", form);
    fetchProducts();
  };

  return (
    <Layout>
      <h2>Products</h2>

      <form onSubmit={addProduct} className="form-inline">
        <input placeholder="Name"
          onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Qty"
          onChange={(e)=>setForm({...form,quantity:e.target.value})}/>
        <input placeholder="Price"
          onChange={(e)=>setForm({...form,price:e.target.value})}/>
        <button>Add</button>
      </form>

      <div className="table">
        {products.map(p=>(
          <div key={p._id} className="row">
            {p.name} - {p.quantity} - ₹{p.price}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Products;
