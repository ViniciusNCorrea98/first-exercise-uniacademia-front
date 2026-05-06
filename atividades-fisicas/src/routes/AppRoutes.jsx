import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PrivateRoute from '../components/PrivateRoute';
import Activities from '../pages/Activities';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';

function PrivatePage({ children }) {
  return (
    <PrivateRoute>
      <Navbar />
      {children}
    </PrivateRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivatePage>
            <Dashboard />
          </PrivatePage>
        }
      />
      <Route
        path="/activities"
        element={
          <PrivatePage>
            <Activities />
          </PrivatePage>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivatePage>
            <Profile />
          </PrivatePage>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
