import React, { useState } from 'react';
import AuthForm from '../components/AuthForm.jsx';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (formData) => {
    try {
      await register(formData);
      setShowVerifyModal(true);
    } catch (error) {
      setError(error.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 bg-gradient-to-r from-teal-100 to-white font-sans text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">
        Budget Tracker Application
      </h1>
      <h2 className="text-xl sm:text-2xl mt-2 mb-6 text-gray-800">
        Create your account
      </h2>
      <div className="auth-form bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <AuthForm onSubmit={handleRegister} submitLabel="Sign Up" initialData={{ name: '', email: '', password: '' }}/>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      {showVerifyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-6 max-w-sm text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
            <p className="mb-6">
              You have successfully registered!! Please check your email to verify your account before logging in.
            </p>
            <button
              onClick={() => setShowVerifyModal(false)}
              className="bg-blue-600 text-white mr-2 px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowVerifyModal(false);
                navigate('/login');//define navigate
              }}
              className="bg-green-600 text-white ml-2 px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
      {/* <div className="auth-form bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <AuthForm
          onSubmit={register}
          submitLabel="Register"
          initialData={{ name: '', email: '', password: '' }}
        />
      </div>*/}
      <p className="mt-6 text-gray-700 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p> 
    </div>
  );
};

export default Register;