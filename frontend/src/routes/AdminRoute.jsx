// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AdminRoute = () => {
  // Lấy thông tin quyền của người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user ? user.role : null;
  const location = useLocation();

  // Cho phép cả Admin và Staff vào trang quản lý
  if (role !== 'Admin' && role !== 'Staff') {
    return <Navigate to="/" replace />; 
  }

  // Nếu là Staff, không được phép vào trang quản lý tài khoản và doanh thu
  if (role === 'Staff') {
    const forbiddenPaths = ['/admin/accounts', '/admin/revenue'];
    if (forbiddenPaths.some(path => location.pathname.startsWith(path))) {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
};

export default AdminRoute;