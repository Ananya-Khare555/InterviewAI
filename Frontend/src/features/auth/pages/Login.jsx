import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });

    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <main className="auth-page">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <h1>InterviewAI</h1>
        <p>
          Crack your dream job with AI-powered interview preparation,
          personalized insights, and resume optimization.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="form-container">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="button primary-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;