import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const [productsRes, invoicesRes] = await Promise.all([
          API.get("/products"),
          API.get("/invoices")
        ]);

        setProducts(productsRes.data);
        setInvoices(invoicesRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
    i.customerName.toLowerCase().includes(query.toLowerCase()) ||
    (i.customerEmail && i.customerEmail.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <Layout>
      <h2 style={{ marginBottom: "20px" }}>Search Results for "{query}"</h2>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <>
          {/* Products Results */}
          <div className="invoice-card" style={{ marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "15px" }}>Products ({filteredProducts.length})</h3>
            {filteredProducts.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>{p.category}</td>
                      <td>
                        <span className={p.quantity < 5 ? "low-stock" : "in-stock"}>
                          {p.quantity}
                        </span>
                      </td>
                      <td>₹ {p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#64748b" }}>No products found matching "{query}".</p>
            )}
          </div>

          {/* Invoices Results */}
          <div className="invoice-card">
            <h3 style={{ marginBottom: "15px" }}>Invoices ({filteredInvoices.length})</h3>
            {filteredInvoices.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(i => (
                    <tr key={i._id}>
                      <td>{i.invoiceNumber}</td>
                      <td>{i.customerName}</td>
                      <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: "600" }}>₹ {i.grandTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ color: "#64748b" }}>No invoices found matching "{query}".</p>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Search;
