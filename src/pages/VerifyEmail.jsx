import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(
          `/auth/verify-email?token=${token}`,
        );
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed");
      }
    };
    if (token) verify();
    else {
      setStatus("error");
      setMessage("Invalid verification link");
    }
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div
          className="auth-logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", marginBottom: "0.5rem" }}
        >
          <svg
            width="24"
            height="24"
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
          Safaraa
        </div>
        {status === "verifying" && <p>Verifying your email...</p>}
        {status === "success" && (
          <>
            <h2 style={{ color: "var(--success-text)" }}>Email Verified!</h2>
            <p>{message}</p>
            <p>
              <Link to="/login">Sign In</Link>
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 style={{ color: "var(--error-text)" }}>Verification Failed</h2>
            <p>{message}</p>
            <p>
              <Link to="/login">Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
