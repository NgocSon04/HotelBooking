import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from './ClientHeader';
import ClientFooter from './ClientFooter';

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header luôn nằm trên cùng */}
      <ClientHeader />

      {/* Main Content sẽ thay đổi tùy theo URL (Trang chủ hoặc Chi tiết phòng) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer luôn nằm dưới cùng */}
      <ClientFooter />
    </div>
  );
};

export default ClientLayout;