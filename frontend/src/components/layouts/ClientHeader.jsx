import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGlobe, FiMoon, FiLogOut, FiClock } from 'react-icons/fi';

const ClientHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return currentPath === '/';
    if (path === '/rooms') return currentPath.startsWith('/rooms');
    return currentPath.startsWith(path);
  };

  return (
    <header className="bg-white py-4 px-8 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-[#8c6b23] tracking-wide">
        Sơn Quân Hotel
      </Link>

      {/* Tích hợp thêm nút Quản lý vào menu */}
      <nav className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-medium text-gray-700 items-center">
        <Link to="/" className={`transition pb-1 border-b-2 ${isActive('/') ? 'text-[#8c6b23] border-[#8c6b23]' : 'border-transparent hover:text-[#8c6b23]'}`}>Trang chủ</Link>
        <Link to="/rooms" className={`transition pb-1 border-b-2 ${isActive('/rooms') ? 'text-[#8c6b23] border-[#8c6b23]' : 'border-transparent hover:text-[#8c6b23]'}`}>Loại phòng</Link>
        <Link to="/services" className={`transition pb-1 border-b-2 ${isActive('/services') ? 'text-[#8c6b23] border-[#8c6b23]' : 'border-transparent hover:text-[#8c6b23]'}`}>Dịch vụ</Link>
        <Link to="/offers" className={`transition pb-1 border-b-2 ${isActive('/offers') ? 'text-[#8c6b23] border-[#8c6b23]' : 'border-transparent hover:text-[#8c6b23]'}`}>Ưu đãi</Link>
        <a 
          href="#footer-contact" 
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`transition pb-1 border-b-2 cursor-pointer border-transparent hover:text-[#8c6b23]`}
        >
          Liên hệ
        </a>
        
        {/* ========================================== */}
        {/* NÚT QUẢN LÝ CHỈ HIỂN THỊ CHO ADMIN / STAFF */}
        {/* ========================================== */}
        {user && (user.role === 'Admin' || user.role === 'Staff') && (
          <Link 
            to="/admin" 
            className="flex items-center text-red-600 font-bold bg-red-50 px-4 py-1.5 rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Vào trang Quản lý
          </Link>
        )}
      </nav>

      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-[#8c6b23]"><FiGlobe size={20} /></button>
        <button className="text-gray-600 hover:text-[#8c6b23]"><FiMoon size={20} /></button>
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        
        {user ? (
          <div className="flex items-center gap-4 relative group cursor-pointer py-2">
            <div className="flex items-center gap-2">
              <img 
                src={user.avatar || 'https://i.pravatar.cc/150'} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-[#8c6b23]" 
              />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 leading-none">Xin chào,</span>
                <span className="text-sm font-bold text-[#0b142f] leading-tight truncate max-w-[120px]">{user.fullName}</span>
              </div>
            </div>

            <div className="absolute top-full right-0 hidden group-hover:flex flex-col bg-white border border-gray-100 shadow-xl rounded-xl min-w-[200px] overflow-hidden transition-all">
              <Link to="/history" className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8c6b23] flex items-center gap-3 border-b border-gray-50">
                <FiClock className="text-lg" /> Lịch sử đặt phòng
              </Link>
              <button onClick={handleLogout} className="px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 text-left flex items-center gap-3 w-full transition">
                <FiLogOut className="text-lg" /> Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-[#8c6b23] transition">Đăng nhập</Link>
            <Link to="/register" className="text-sm font-medium bg-[#0b142f] text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition">Đăng ký</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default ClientHeader;