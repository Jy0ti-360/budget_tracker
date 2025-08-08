import React, { useState } from 'react';
import * as authService from '../services/authService';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      await authService.sendResetLink(email);
      setStatus('Password reset link has been sent to your email.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 bg-gradient-to-r from-teal-100 to-white font-sans text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">
        Forgot Password
      </h1>
      <p className="text-sm text-gray-600 mb-6 max-w-sm">
        Enter your registered email address and we'll send you a link to reset your password.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md text-centre"
      >
        <label className="block mb-2 font-semibold text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Send Reset Link
        </button>

        {status && <p className="text-green-600 mt-4">{status}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>

      <Link
        to="/login"
        className="mt-6 text-blue-600 text-sm hover:underline"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default ForgotPassword;