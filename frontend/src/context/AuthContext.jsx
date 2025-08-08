import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);

      if(!data.isVerfied){
        alert("Your email is not verified. Please check your inbox.");
        return;
      }

      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (error) {
      if(error.response?.data?.message === "Email not verified"){
        alert("Email is not verified. Please verify your email before logging in.");
      }else{
        alert("Login failed. Check your credentials.");
      }
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (form) => {
    try {
      const data = await authService.register(form);
      return data;
    } catch (error) {
      console.error('Registration failed : ', error);
      throw error;
    }
  };

  const logout = () => {
    const confirmed = window.confirm("Are you sure to want to logout from the application!");
    if(confirmed){
      try {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } catch (error) {
        console.log("Error while logging in : ",error)
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
