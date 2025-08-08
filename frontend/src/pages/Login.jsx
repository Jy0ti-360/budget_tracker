import React from 'react';
import AuthForm from '../components/AuthForm';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 bg-gradient-to-r from-teal-100 to-white font-sans text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-800">
        Welcome to Budget Tracker App
      </h1>
      <h2 className="text-lg sm:text-xl mb-6 text-gray-600">
        Log In to continue
      </h2>
      <div className="auth-form bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <AuthForm
          onSubmit={login}
          submitLabel="Log In"
          initialData={{ email: '', password: '' }}
        />
        <div className="text-centre mt-3">
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
      <p className="mt-6 text-gray-700 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto">
        Don’t have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
