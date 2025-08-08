import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('Invalid or missing token.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('Verification failed. Token may be expired or invalid.');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
