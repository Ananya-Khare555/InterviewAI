import React from "react";
import { useNavigate } from "react-router";
import "./landing.scss";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <main className="landing">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <h2>InterviewAI</h2>

        <div className="nav-actions">
          <button onClick={() => navigate("/login")} className="ghost-btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="primary-btn">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          Crack Your Dream Job with <span>AI</span>
        </h1>

        <p>
          Personalized interview questions, skill gap analysis, and
          resume optimization — all powered by AI.
        </p>

        <div className="hero-actions">
          <button
            className="primary-btn large"
            onClick={() => navigate("/register")}
          >
            Start for Free
          </button>

          <button
            className="ghost-btn large"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <h3>🎯 Smart Interview Prep</h3>
          <p>Get tailored technical & behavioral questions</p>
        </div>

        <div className="feature-card">
          <h3>📊 Skill Gap Analysis</h3>
          <p>Know exactly what you’re missing</p>
        </div>

        <div className="feature-card">
          <h3>📄 AI Resume Builder</h3>
          <p>Generate ATS-friendly resumes instantly</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 InterviewAI. Built for developers 🚀</p>
      </footer>

    </main>
  );
};

export default Landing;