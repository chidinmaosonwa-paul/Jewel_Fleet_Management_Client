import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const About = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing">
      {/* Navbar */}
      <div className="landing-nav">
        <div
          className="landing-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="26" r="4" fill="var(--accent)" />
            <circle cx="26" cy="6" r="4" fill="var(--accent)" opacity="0.5" />
            <path
              d="M6 26 C6 14 26 18 26 6"
              stroke="var(--accent)"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          Safara
        </div>
        <div className="landing-nav-links">
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              padding: "0.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
            }}
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button className="btn-ghost" onClick={() => navigate("/")}>
            Home
          </button>
          <button className="btn-ghost" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </div>

      {/* Hero */}
      <section
        style={{
          padding: "5rem 4rem",
          background: "var(--bg-primary)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 900,
          }}
        >
          About Safara
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Safara is a complete fleet management platform built for travel
          companies. We help businesses manage their vehicles, schedule
          journeys, and give passengers a seamless booking experience, all in
          one place.
        </p>
      </section>

      {/* Story */}
      <section style={{ padding: "4rem", background: "var(--bg-secondary)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              color: "var(--text-primary)",
              marginBottom: "1.5rem",
            }}
          >
            The Story
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            Running a travel company is complex. Managing a fleet of vehicles,
            coordinating drivers, tracking passenger bookings, and keeping
            finances in order all at the same time, is no small feat.
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "1rem",
              textAlign: "left",
            }}
          >
            Safara was built to bring all of that together. One platform where
            operators have complete visibility over their fleet, drivers stay
            connected to their assignments, and passengers enjoy a smooth
            booking experience from anywhere.
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              textAlign: "left",
            }}
          >
            The name Safara means travel. Everything we build starts and ends
            with that idea.
          </p>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "4rem", background: "var(--bg-primary)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "1.8rem",
              color: "var(--text-primary)",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            What We Stand For
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Simplicity</h3>
              <p>
                Complex operations should have simple interfaces. Every feature
                in Safara is designed to be intuitive from day one.
              </p>
            </div>
            <div className="feature-card">
              <h3>Reliability</h3>
              <p>
                Travel companies depend on us to keep their operations running.
                We take that responsibility seriously.
              </p>
            </div>
            <div className="feature-card">
              <h3>Transparency</h3>
              <p>
                Every transaction, every journey, every report; fully tracked
                and available to the people who need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>
          Join travel companies already using Safara to run their operations.
        </p>
        <button
          className="btn-primary btn-large"
          onClick={() => navigate("/register")}
        >
          Get Started for Free
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Safara. Built with love from Lagos.</p>
      </footer>
    </div>
  );
};

export default About;
