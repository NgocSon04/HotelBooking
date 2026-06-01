// src/components/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      {/* Sidebar fixed bên trái */}
      <Sidebar />

      {/* Phần nội dung chính nằm bên phải Sidebar */}
      <div className="flex-1 ml-64 flex flex-col">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Nơi chứa các trang con (Dashboard, Quản lý phòng...) */}
        <main className="flex-1 p-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;