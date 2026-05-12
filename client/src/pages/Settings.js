import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const Settings = () => {
  const { user, login } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    gstNumber: "",
    address: ""
  });

  const [profileForm, setProfileForm] = useState({
    name: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await API.get("/company");
        if (res.data) {
          setForm(res.data);
        }
      } catch (err) { console.log(err); }
    };
    fetchCompany();
    if (user) {
      setProfileForm({ name: user.name });
    }
  }, [user]);

  const submitCompany = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("gstNumber", form.gstNumber);
    formData.append("address", form.address);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await API.post("/company", formData);
      alert("Company details updated!");
    } catch (err) { alert("Failed to update company"); }
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put("/user/profile", profileForm);
      // Update local storage and context
      const token = localStorage.getItem("token");
      login({ token, user: data });
      alert("Profile updated!");
    } catch (err) { alert("Failed to update profile"); }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await API.put("/user/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      alert("Password updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <Layout>
      <div className="page-title">System Settings</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
        
        {/* BUSINESS INFO */}
        <div className="invoice-card">
          <h3>Business Details</h3>
          <form onSubmit={submitCompany} style={{ marginTop: "15px" }}>
            <label style={{ fontSize: "12px", color: "#64748b" }}>Company Name</label>
            <input
              placeholder="Company Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label style={{ fontSize: "12px", color: "#64748b" }}>GST Number</label>
            <input
              placeholder="GST Number"
              value={form.gstNumber}
              onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            />

            <label style={{ fontSize: "12px", color: "#64748b" }}>Business Address</label>
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

            <label style={{ fontSize: "12px", color: "#64748b" }}>Business Logo</label>
            <input
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              style={{ border: "none", padding: "5px 0" }}
            />

            <button className="btn-primary" style={{ width: "100%", marginTop: "10px" }}>Save Business Info</button>
          </form>
        </div>

        {/* PROFILE & PASSWORD */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          <div className="invoice-card">
            <h3>User Profile</h3>
            <div style={{ margin: "10px 0", padding: "10px", background: "#f8fafc", borderRadius: "8px" }}>
              <div style={{ fontSize: "14px" }}><strong>Email:</strong> {user?.email}</div>
              <div style={{ fontSize: "14px", marginTop: "5px" }}><strong>Role:</strong> <span style={{ textTransform: "capitalize", color: "#2563eb", fontWeight: "600" }}>{user?.role}</span></div>
            </div>
            
            <form onSubmit={submitProfile} style={{ marginTop: "15px" }}>
              <label style={{ fontSize: "12px", color: "#64748b" }}>Full Name</label>
              <input
                placeholder="Your Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
              <button className="btn-primary" style={{ width: "100%" }}>Update Profile</button>
            </form>
          </div>

          <div className="invoice-card">
            <h3>Update Password</h3>
            <form onSubmit={submitPassword} style={{ marginTop: "15px" }}>
              <input
                type="password"
                placeholder="Current Password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
              <button className="btn-primary" style={{ width: "100%" }}>Update Password</button>
            </form>
          </div>

        </div>

      </div>
    </Layout>
  );
};

export default Settings;
