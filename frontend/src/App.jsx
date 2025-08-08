import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import useAuth from './hooks/useAuth';

const App = () => {
  const {user, loading} = useAuth();

  if (loading) return <div>Loading...</div>;

  return(
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/verify-email' element={<VerifyEmail/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
      </Routes>
  )
}

export default App;
