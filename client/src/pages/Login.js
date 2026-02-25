import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import "../index.css"; // make sure global css imported

const Login = () => {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">

      <div className="auth-left">
        <h1>Profitex</h1>
        <p>Smart Billing & Inventory Management System</p>
      </div>

      <div className="auth-right">
        <form className="auth-card" onSubmit={submit}>
          <h2>Login to your account</h2>

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button type="submit">Login</button>

          <div className="auth-link">
            Don't have an account?{" "}
            <Link to="/register">Create new account</Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;
