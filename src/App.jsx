import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CustomerDashboard from './pages/CustomerDashboard';
import ResetPassword from './pages/ResetPassword';

// Route Guard for Authenticated Users
const RequireAuth = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If authenticated but role not allowed, redirect to correct default page
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

// Route Guard for Guest Users (redirects logged-in users away from login/register)
const GuestOnly = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

// Layout component to calculate active page title from route
const AdminLayout = ({ children }) => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/admin/dashboard':
        return 'Tổng quan hoạt động';
      case '/bookings':
        return 'Đặt lịch rửa xe';
      case '/customers':
        return 'Hồ sơ khách hàng';
      case '/services':
        return 'Danh mục dịch vụ';
      case '/payments':
        return 'Nhật ký thanh toán';
      case '/reports':
        return 'Thống kê & Doanh thu';
      default:
        return 'Hệ thống AutoWash';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="main-content">
        <Navbar pageTitle={getPageTitle(location.pathname)} />
        <div className="content-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Root Router Redirector
const RootRedirect = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
            <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
            <Route path="/reset-password" element={<GuestOnly><ResetPassword /></GuestOnly>} />

            {/* Root Route Redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Customer Protected Route */}
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth allowedRoles={['CUSTOMER']}>
                  <CustomerDashboard />
                </RequireAuth>
              } 
            />

            {/* Admin Protected Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Bookings />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Customers />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/services" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Services />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/payments" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Payments />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <RequireAuth allowedRoles={['ADMIN']}>
                  <AdminLayout>
                    <Reports />
                  </AdminLayout>
                </RequireAuth>
              } 
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
