import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiLogOut, FiClock, FiGift, FiUser, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

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

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Mở modal và load thông tin từ Backend
  const handleOpenProfile = async () => {
    if (!user || !user.id) return;
    setProfileLoading(true);
    setShowProfileModal(true);
    setAvatarFile(null);
    setAvatarPreview(user.avatar || '');
    
    // Set tạm data từ localStorage
    setProfileData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      newPassword: '',
      confirmNewPassword: ''
    });

    try {
      const res = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      const userData = res.data;
      setProfileData({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setAvatarPreview(userData.avatar || '');
    } catch (err) {
      console.error("Lỗi lấy thông tin cá nhân:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Submit sửa đổi profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;

    if (profileData.newPassword || profileData.confirmNewPassword) {
      if (profileData.newPassword !== profileData.confirmNewPassword) {
        toast.error("Mật khẩu xác nhận không trùng khớp!");
        return;
      }
      if (profileData.newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', profileData.fullName);
      formDataToSend.append('phone', profileData.phone);
      if (profileData.newPassword) {
        formDataToSend.append('password', profileData.newPassword);
      }
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      } else {
        formDataToSend.append('avatar', profileData.avatar);
      }

      const res = await axios.put(`http://localhost:5000/api/users/${user.id}/profile`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Cập nhật thông tin cá nhân thành công!");
      
      // Cập nhật lại localStorage và state user
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowProfileModal(false);
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật thông tin cá nhân!");
    }
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
        <Link to="/contact" className={`transition pb-1 border-b-2 ${isActive('/contact') ? 'text-[#8c6b23] border-[#8c6b23]' : 'border-transparent hover:text-[#8c6b23]'}`}>Liên hệ</Link>
        
        {/* NÚT QUẢN LÝ CHỈ HIỂN THỊ CHO ADMIN / STAFF */}

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
              <Link to="/my-offers" className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8c6b23] flex items-center gap-3 border-b border-gray-50">
                <FiGift className="text-lg" /> Khuyến mãi của bạn
              </Link>
              <button onClick={handleOpenProfile} className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#8c6b23] flex items-center gap-3 border-b border-gray-50 w-full text-left transition">
                <FiUser className="text-lg" /> Sửa hồ sơ
              </button>
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

      {/* PROFILE EDIT MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FiUser className="text-[#8c6b23]" /> Chỉnh Sửa Hồ Sơ
              </h2>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="text-gray-400 hover:text-red-500 transition"
              >
                <FiX size={24}/>
              </button>
            </div>

            {profileLoading ? (
              <div className="p-10 text-center text-gray-500 font-medium">Đang tải thông tin...</div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Họ và tên</label>
                  <input 
                    required 
                    type="text" 
                    value={profileData.fullName} 
                    onChange={e => setProfileData({...profileData, fullName: e.target.value})} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23]/20"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    disabled 
                    type="email" 
                    value={profileData.email} 
                    className="w-full border border-gray-100 bg-gray-50 text-gray-400 rounded-lg px-4 py-2 text-sm cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Số điện thoại</label>
                  <input 
                    required 
                    type="text" 
                    value={profileData.phone} 
                    onChange={e => setProfileData({...profileData, phone: e.target.value})} 
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23]/20"
                  />
                </div>

                <div className="flex flex-col items-center gap-2 mb-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Ảnh đại diện</label>
                  <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-[#8c6b23] shadow-md">
                    <img 
                      src={avatarPreview || 'https://i.pravatar.cc/150'} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-medium">
                      Thay đổi
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <span className="text-[10px] text-gray-400">Chọn ảnh (JPEG, PNG) để tải lên</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 font-bold mb-3 uppercase tracking-wider">Đổi mật khẩu (Bỏ trống nếu không muốn đổi)</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={profileData.newPassword} 
                        onChange={e => setProfileData({...profileData, newPassword: e.target.value})} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={profileData.confirmNewPassword} 
                        onChange={e => setProfileData({...profileData, confirmNewPassword: e.target.value})} 
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowProfileModal(false)} 
                    className="w-1/2 py-2.5 rounded-lg text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 py-2.5 rounded-lg text-sm font-bold text-white bg-[#8c6b23] hover:bg-[#70551c] transition shadow-md"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </header>
  );
};

export default ClientHeader;