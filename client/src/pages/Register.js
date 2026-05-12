import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin"
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <h1>Profitex</h1>
        <p>Create your business account and manage everything smartly.</p>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={submit}>
          <h2>Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            value={form.role}
            required
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd" }}
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <button type="submit">Register</button>

          <div className="auth-link">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
