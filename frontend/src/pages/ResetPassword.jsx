import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FiArrowLeft, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiXCircle, FiShield } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true); // Giả sử token hợp lệ khi vào trang

  // Kiểm tra độ mạnh mật khẩu
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: 'Rất yếu', color: 'bg-red-500' };
    if (score === 2) return { level: 2, label: 'Yếu', color: 'bg-orange-400' };
    if (score === 3) return { level: 3, label: 'Trung bình', color: 'bg-yellow-400' };
    if (score === 4) return { level: 4, label: 'Mạnh', color: 'bg-blue-500' };
    return { level: 5, label: 'Rất mạnh', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(formData.password);

  // Các điều kiện mật khẩu
  const rules = [
    { label: 'Ít nhất 6 ký tự', met: formData.password.length >= 6 },
    { label: 'Chứa ít nhất 1 chữ số', met: /[0-9]/.test(formData.password) },
    { label: 'Mật khẩu khớp nhau', met: formData.password && formData.password === formData.confirmPassword }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      setSuccess(true);
      toast.success('Đặt lại mật khẩu thành công!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Đã xảy ra lỗi!';
      if (msg.includes('hết hạn') || msg.includes('không hợp lệ')) {
        setTokenValid(false);
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Tự động chuyển về Login sau khi thành công
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 3500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="min-h-screen flex font-sans bg-white">
      <ToastContainer position="top-right" />

      {/* Cột trái: Hình ảnh */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-in-out"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f] via-[#0b142f]/60 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <div className="mb-6 flex items-center gap-2 text-yellow-500">
            {'★'.repeat(5)}
          </div>
          <h2 className="text-5xl font-bold mb-4 leading-tight tracking-tight">
            Tạo mật khẩu<br />mới an toàn
          </h2>
          <p className="text-lg text-gray-300 font-light leading-relaxed max-w-md">
            Hãy tạo một mật khẩu mạnh và độc đáo để bảo vệ tài khoản Sơn Quân Hotel của bạn.
          </p>
          {/* Mẹo bảo mật */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-bold text-[#f0c060] uppercase tracking-widest">💡 Mẹo tạo mật khẩu mạnh</p>
            {[
              'Sử dụng ít nhất 8-12 ký tự',
              'Kết hợp chữ hoa, chữ thường, số',
              'Thêm ký tự đặc biệt (@, #, $...)',
              'Không dùng thông tin cá nhân'
            ].map((tip, i) => (
              <p key={i} className="text-sm text-gray-300 flex items-center gap-2">
                <span className="text-green-400">✓</span> {tip}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Cột phải: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <Link
          to="/login"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#8c6b23] font-bold transition-colors"
        >
          <FiArrowLeft size={16} /> Quay lại đăng nhập
        </Link>

        <div className="w-full max-w-md mt-10 lg:mt-0">

          {/* === TOKEN HẾT HẠN === */}
          {!tokenValid && (
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiXCircle size={40} className="text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-[#0b142f] mb-3">Link đã hết hạn</h2>
              <p className="text-gray-500 mb-8">
                Link đặt lại mật khẩu của bạn đã hết hạn hoặc không hợp lệ. Mỗi link chỉ có hiệu lực trong <strong>15 phút</strong>.
              </p>
              <Link
                to="/forgot-password"
                className="block w-full text-center bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#8c6b23]/30 mb-4"
              >
                Yêu cầu link mới
              </Link>
              <Link to="/login" className="text-sm text-gray-500 hover:text-[#8c6b23] transition-colors font-medium">
                ← Quay lại đăng nhập
              </Link>
            </div>
          )}

          {/* === ĐẶT LẠI THÀNH CÔNG === */}
          {success && (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-3xl font-black text-[#0b142f] mb-3">Thành công! 🎉</h2>
              <p className="text-gray-500 mb-2">Mật khẩu của bạn đã được cập nhật thành công.</p>
              <p className="text-sm text-gray-400 mb-8">Bạn sẽ được chuyển về trang đăng nhập sau <strong>3 giây</strong>...</p>
              {/* Progress bar đếm ngược */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8">
                <div className="bg-gradient-to-r from-[#8c6b23] to-[#b38d38] h-1.5 rounded-full animate-[shrink_3.5s_linear_forwards]" style={{ width: '100%', animation: 'width 3.5s linear forwards' }} />
              </div>
              <Link
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#8c6b23]/30"
              >
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {/* === FORM ĐẶT LẠI MẬT KHẨU === */}
          {!success && tokenValid && (
            <>
              <div className="mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8c6b23] to-[#b38d38] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8c6b23]/30">
                  <FiShield size={28} className="text-white" />
                </div>
                <h2 className="text-4xl font-black text-[#0b142f] tracking-tight mb-3">Mật khẩu mới</h2>
                <p className="text-gray-500 leading-relaxed">
                  Tạo mật khẩu mới cho tài khoản của bạn. Đảm bảo mật khẩu đủ mạnh và dễ nhớ.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mật khẩu mới */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Mật khẩu mới</label>
                  <div className="relative group">
                    <FiLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors"
                      size={20}
                    />
                    <input
                      id="reset-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 text-gray-800 outline-none focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c6b23] transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>

                  {/* Thanh độ mạnh mật khẩu */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-bold ${strength.level <= 2 ? 'text-red-500' : strength.level === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        Độ mạnh: {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <FiLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors"
                      size={20}
                    />
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full bg-gray-50 border rounded-xl pl-12 pr-12 py-3.5 text-gray-800 outline-none transition-all focus:ring-4 ${
                        formData.confirmPassword
                          ? formData.password === formData.confirmPassword
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/10'
                            : 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
                          : 'border-gray-200 focus:border-[#8c6b23] focus:ring-[#8c6b23]/10 focus:bg-white'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c6b23] transition-colors"
                    >
                      {showConfirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Checklist điều kiện */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {rule.met ? (
                        <FiCheckCircle size={15} className="text-green-500 shrink-0" />
                      ) : (
                        <FiXCircle size={15} className="text-gray-300 shrink-0" />
                      )}
                      <span className={`text-sm transition-colors ${rule.met ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button
                  id="reset-submit"
                  type="submit"
                  disabled={loading || !rules.every(r => r.met)}
                  className="w-full bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white font-bold py-4 rounded-xl hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#8c6b23]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <FiShield size={18} />
                      Đặt lại mật khẩu
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-8">
                Nhớ ra mật khẩu?{' '}
                <Link to="/login" className="text-[#8c6b23] font-bold hover:underline">
                  Đăng nhập
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
