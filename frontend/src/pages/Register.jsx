import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex">
      <ToastContainer />
      {/* Cột trái: Hình ảnh */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0b142f] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Sơn Quân Hotel</h1>
          <p className="text-gray-400">Nâng tầm trải nghiệm lưu trú.</p>
        </div>
        <ul className="relative z-10 space-y-3 text-sm text-gray-300">
          <li>✓ Quản lý đặt khách sạn chuyên nghiệp</li>
          <li>✓ Theo dõi chi phí minh bạch</li>
          <li>✓ Hỗ trợ khách hàng 24/7</li>
        </ul>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
          <p className="text-gray-500 mb-8 text-sm">Điền thông tin dưới đây để đăng ký dịch vụ tại Sơn Quân Hotel.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Họ và tên</label>
              <input type="text" required onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]" placeholder="Nhập họ và tên của bạn" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Email</label>
              <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]" placeholder="example@email.com" />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Số điện thoại</label>
              <input type="text" required onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]" placeholder="090 123 4567" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Mật khẩu</label>
                <input type="password" required onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Xác nhận mật khẩu</label>
                <input type="password" required onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#8c6b23] text-white font-bold py-3 rounded-lg mt-4 hover:bg-[#7a5c1e] transition">Đăng ký</button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Đã có tài khoản? <Link to="/login" className="text-[#8c6b23] font-bold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;