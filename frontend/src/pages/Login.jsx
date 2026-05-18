import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success("Đăng nhập thành công!");

      setTimeout(() => {
        const userRole = res.data.user.role;
        if (userRole === 'Admin' || userRole === 'Staff') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Email hoặc mật khẩu không đúng!");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      <ToastContainer position="top-right" />
      
      {/* Cột trái: Hình ảnh nền có Gradient & Animation */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        {/* Ảnh nền có hiệu ứng zoom in nhẹ khi hover chuột vào cột trái */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-in-out"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d2748610?q=80&w=2000')" }}
        ></div>
        {/* Lớp phủ gradient để làm nổi bật text */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f] via-[#0b142f]/60 to-transparent"></div>
        
        {/* Nội dung trên ảnh */}
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <div className="mb-6 flex items-center gap-2 text-yellow-500">
             {'★'.repeat(5)}
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight tracking-tight">Khám phá<br/>trải nghiệm đẳng cấp</h1>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md">
            Chào mừng bạn trở lại với Sơn Quân Hotel. Hãy đăng nhập để tận hưởng những đặc quyền cao cấp dành riêng cho khách hàng thân thiết.
          </p>
        </div>
      </div>

      {/* Cột phải: Form Đăng nhập */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        
        {/* Nút Quay lại trang chủ */}
        <Link 
          to="/" 
          className="absolute top-8 right-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#8c6b23] font-bold transition-colors bg-gray-50 px-4 py-2 rounded-full hover:bg-yellow-50"
        >
          <FiArrowLeft size={16} /> Quay lại trang chủ
        </Link>

        <div className="w-full max-w-md mt-10 lg:mt-0">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#0b142f] tracking-tight mb-3">Đăng nhập</h2>
            <p className="text-gray-500">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Email</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 outline-none focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10 transition-all" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>
            
            {/* Input Password */}
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-2">Mật khẩu</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 outline-none focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10 transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {/* Checkbox & Quên MK */}
            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8c6b23] focus:ring-[#8c6b23]" />
                <span className="font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="#" className="text-[#8c6b23] font-bold hover:underline">Quên mật khẩu?</Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0b142f] text-white font-bold py-4 rounded-xl hover:bg-gray-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 mt-4"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center text-gray-400">
            <hr className="flex-grow border-gray-200" />
            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Hoặc đăng nhập bằng</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Social Logins */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <FcGoogle size={22} /> Google
            </button>
            <button className="flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
              <FaFacebook size={22} className="text-[#1877F2]" /> Facebook
            </button>
          </div>

          {/* Chuyển sang Đăng ký */}
          <p className="text-center text-sm text-gray-600 mt-10">
            Chưa có tài khoản? <Link to="/register" className="text-[#8c6b23] font-bold hover:underline ml-1">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;