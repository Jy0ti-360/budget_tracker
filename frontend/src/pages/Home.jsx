import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="text-yellow-700" >
      <h1>Welcome to Budget Tracker App</h1>
      {user ? (
        <Link to="/dashboard">Go to Dashboard</Link>
      ) : (
        <>
          <Link to="/login">Log In</Link> | <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
};

export default Home;
