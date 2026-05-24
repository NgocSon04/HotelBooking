// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Lấy thông tin quyền của người dùng từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user ? user.role : null;

  // Nếu không phải admin (có thể là client hoặc chưa đăng nhập) -> Đá về trang chủ
  if (role !== 'Admin') {
    // Bạn có thể đổi to="/" thành to="/login" tùy ý đồ của nhóm
    return <Navigate to="/" replace />; 
  }

  // Nếu đúng là admin -> Cho phép đi tiếp vào giao diện (Outlet đại diện cho AdminLayout)
  return <Outlet />;
};

export default AdminRoute;                                                                  