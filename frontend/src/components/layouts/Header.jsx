import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm phòng, khách hàng, mã đặt..."
            className="w-full bg-gray-50 text-sm text-gray-700 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-4">
        {/* Notification */}
        <button className="relative text-gray-500 hover:text-gray-700 transition">
          <FiBell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="w-px h-8 bg-gray-200"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
             <img src={adminUser?.avatar || "https://i.pravatar.cc/150?img=33"} alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">{adminUser ? adminUser.fullName : 'Nguyễn Văn A'}</p>
            <p className="text-xs text-gray-500">{adminUser?.role || 'Admin'}</p>
          </div>
          <FiChevronDown className="text-gray-400 ml-1" />
        </button>
      </div>
    </header>
  );
};

export default Header;