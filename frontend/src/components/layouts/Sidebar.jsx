import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiGrid, 
  FiCalendar, 
  FiUser, 
  FiSettings, 
  FiPlus, 
  FiBriefcase, 
  FiGift,
  FiLogOut
} from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  // Lấy thông tin Admin từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Tổng quan', icon: <FiGrid className="w-5 h-5" />, path: '/admin' },
    { name: 'Quản lý khách sạn', icon: <MdOutlineKingBed className="w-5 h-5" />, path: '/admin/rooms' },
    { name: 'Quản lý đặt khách sạn', icon: <FiCalendar className="w-5 h-5" />, path: '/admin/bookings' },
    { name: 'Quản lý dịch vụ', icon: <FiBriefcase className="w-5 h-5" />, path: '/admin/services' },
    { name: 'Quản lý ưu đãi', icon: <FiGift className="w-5 h-5" />, path: '/admin/offers' },
    { name: 'Quản lý tài khoản', icon: <FiUser className="w-5 h-5" />, path: '/admin/accounts' },
    { name: 'Quản lý doanh thu', icon: <BiMoney className="w-5 h-5" />, path: '/admin/revenue' },
    { name: 'Cài đặt', icon: <FiSettings className="w-5 h-5" />, path: '/admin/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-[#0b142f] text-white flex flex-col fixed left-0 top-0 z-50 shadow-2xl">
      {/* Logo */}
      <div className="p-6 mb-2">
        <h1 className="text-2xl font-bold tracking-wider leading-tight">
          Sơn Quân<br />Booking
        </h1>
      </div>

      {/* Admin Info - Dữ liệu Động */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gray-500 overflow-hidden border-2 border-gray-400 shadow-md">
          <img 
            src={adminUser?.avatar || "https://i.pravatar.cc/150?img=11"} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase tracking-tighter text-[#facc15] font-bold">
            {adminUser?.role || 'Quản trị viên'}
          </p>
          <p className="text-sm font-bold text-white truncate">
            {adminUser ? adminUser.fullName : 'Đang tải...'}
          </p>
          <p className="text-[10px] text-gray-400 truncate">
            {adminUser ? adminUser.email : 'Hotel Admin'}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[#facc15] text-[#0b142f] font-bold shadow-lg shadow-yellow-500/20'
                  : 'text-gray-400 hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-[#0b142f]' : 'group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Khu vực chức năng ở dưới cùng */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <button className="w-full flex items-center justify-center gap-2 bg-[#facc15] text-[#0b142f] font-bold py-3 rounded-xl hover:bg-yellow-500 transition-all active:scale-95 shadow-md">
          <FiPlus className="w-5 h-5" />
          Báo cáo mới
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 font-medium py-2 rounded-xl transition-all"
        >
          <FiLogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;