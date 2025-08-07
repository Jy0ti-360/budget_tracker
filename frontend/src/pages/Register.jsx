import React from 'react';
import AuthForm from '../components/AuthForm.jsx';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 sm:px-8 bg-gradient-to-r from-teal-100 to-white font-sans text-center">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
        Register
      </h2>
      <div className="auth-form bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <AuthForm
          onSubmit={register}
          submitLabel="Register"
          initialData={{ name: '', email: '', password: '' }}
        />
      </div>
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