// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Lấy thông tin quyền của người dùng từ localStorage
  const role = localStorage.getItem('role'); 

  // Nếu không phải admin (có thể là client hoặc chưa đăng nhập) -> Đá về trang chủ
  if (role !== 'admin') {
    // Bạn có thể đổi to="/" thành to="/login" tùy ý đồ của nhóm
    return <Navigate to="/" replace />; 
  }

  // Nếu đúng là admin -> Cho phép đi tiếp vào giao diện (Outlet đại diện cho AdminLayout)
  return <Outlet />;
};

export default AdminRoute;                                                                  