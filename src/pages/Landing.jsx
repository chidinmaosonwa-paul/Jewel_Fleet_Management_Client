import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        } else {
          setCount(0);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const HeroCard = ({ target, prefix = "", label, sub }) => {
  const { count, ref } = useCountUp(target);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${prefix}${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${prefix}${(num / 1000).toFixed(0)}k`;
    return `${prefix}${num.toLocaleString()}`;
  };

  return (
    <div className="hero-card" ref={ref}>
      <p className="hero-card-label">{label}</p>
      <h2>{formatNumber(count)}</h2>
      <p className="hero-card-sub">{sub}</p>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      title: "Fleet Management",
      description:
        "Manage your entire fleet of vehicles, track their status, and assign drivers with ease.",
    },
    {
      title: "Route Planning",
      description:
        "Create and manage destinations, set fares, and schedule journeys across multiple routes.",
    },
    {
      title: "Ticket Booking",
      description:
        "Passengers can browse available journeys and book tickets instantly from any device.",
    },
    {
      title: "Journey Reports",
      description:
        "Drivers submit detailed journey reports including fuel consumption and passenger feedback.",
    },
    {
      title: "Passenger Manifests",
      description:
        "Generate professional PDF passenger manifests for any journey with a single click.",
    },
    {
      title: "Financial Reports",
      description:
        "Track revenue, expenses, and net profit with detailed date-range financial reports.",
    },
  ];

  return (
    <div className="landing">
      {/* Navbar */}
      <div className="landing-nav">
        <div className="landing-logo">
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
          <button className="btn-ghost" onClick={() => navigate("/about")}>
            About
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
      <section className="hero">
        <div className="hero-content">
          <h1>
            Smarter journeys,
            <br />
            seamless booking.
          </h1>
          <p>
            A complete fleet management solution for travel companies. Manage
            vehicles, schedule journeys, and let passengers book tickets, all in
            one place.
          </p>
          <div className="hero-buttons">
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
            <button
              className="btn-outline btn-large"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <HeroCard
            target={2450000}
            prefix="₦"
            label="Total Revenue"
            sub="+12% this month"
          />
          <HeroCard target={24} label="Active Journeys" sub="across 8 routes" />
          <HeroCard target={1284} label="Tickets Booked" sub="this week" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Everything you need to run your fleet</h2>
        <p className="features-sub">
          Built for travel companies of all sizes, from single routes to
          nationwide operations.
        </p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to manage your fleet smarter?</h2>
        <p>
          Join travel companies already using Safara to streamline their
          operations.
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

export default Landing;
