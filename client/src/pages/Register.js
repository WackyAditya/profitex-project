import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
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
