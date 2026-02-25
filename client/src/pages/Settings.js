import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const Settings = () => {

  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    address: ""
  });

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await API.get("/company");
      if (res.data) {
        setForm(res.data);
      }
    };
    fetchCompany();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("gstNumber", form.gstNumber);
    formData.append("address", form.address);
    if (logo) {
      formData.append("logo", logo);
    }

    await API.post("/company", formData);

    alert("Company Saved");
  };

  return (
    <Layout>
      <div className="page-title">Company Settings</div>

      <div className="invoice-card">
        <form onSubmit={submit}>
          <input
            placeholder="Company Name"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
          />

          <input
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={(e)=>setForm({...form,gstNumber:e.target.value})}
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e)=>setForm({...form,address:e.target.value})}
          />

          <input
            type="file"
            onChange={(e)=>setLogo(e.target.files[0])}
          />

          <button className="btn-primary">Save</button>
        </form>
      </div>
    </Layout>
  );
};

export default Settings;
