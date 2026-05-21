import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    if (token) verify();
    else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>Safara</h1>
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h2 style={{ color: 'var(--success-text)' }}>Email Verified!</h2>
            <p>{message}</p>
            <p><Link to="/login">Sign In</Link></p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 style={{ color: 'var(--error-text)' }}>Verification Failed</h2>
            <p>{message}</p>
            <p><Link to="/login">Back to Sign In</Link></p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;