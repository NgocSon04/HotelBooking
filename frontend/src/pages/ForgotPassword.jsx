import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  FiArrowLeft, FiMail, FiLock, FiEye, FiEyeOff,
  FiCheckCircle, FiShield, FiRefreshCw
} from 'react-icons/fi';
import { MdOutlinePassword } from 'react-icons/md';
import 'react-toastify/dist/ReactToastify.css';

/* ─── Component OTP tùy chỉnh (6 ô nhập) ─── */
const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);
  const digits = value.split('');

  const handleKey = (e, idx) => {
    const key = e.key;
    if (key === 'Backspace') {
      const next = [...digits];
      if (next[idx]) { next[idx] = ''; onChange(next.join('')); }
      else if (idx > 0) { next[idx - 1] = ''; onChange(next.join('')); inputsRef.current[idx - 1]?.focus(); }
    } else if (/^[0-9]$/.test(key)) {
      const next = [...digits];
      next[idx] = key;
      onChange(next.join(''));
      if (idx < 5) inputsRef.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i}
          ref={el => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={() => {}} // handled by onKeyDown
          onKeyDown={e => handleKey(e, i)}
          onFocus={e => e.target.select()}
          className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all duration-200 
            ${digits[i]
              ? 'border-[#8c6b23] bg-[#fff8e7] text-[#8c6b23] shadow-md shadow-[#8c6b23]/20'
              : 'border-gray-200 bg-gray-50 text-gray-800 focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10'
            }`}
        />
      ))}
    </div>
  );
};

/* ─── Component chính ─── */
const ForgotPassword = () => {
  const navigate = useNavigate();

  // 3 bước: 1=nhập email, 2=nhập OTP, 3=thành công
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Đếm ngược để gửi lại OTP
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Tự redirect về login sau khi thành công
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  /* ── STEP 1: Gửi yêu cầu OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.warning('Vui lòng nhập email!'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      const otpCode = res.data.otp;

      // ── Hiện toast ở góc phải với mã OTP nổi bật ──
      toast.info(
        <div style={{ fontFamily: 'sans-serif' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Mã xác nhận của bạn là:</p>
          <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 900, letterSpacing: 6, color: '#8c6b23' }}>
            {otpCode}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#999' }}>Hết hạn sau 10 phút</p>
        </div>,
        {
          position: 'top-right',
          autoClose: 30000,       // Tồn tại 30 giây để user kịp nhập
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          style: { minWidth: 240, borderLeft: '4px solid #8c6b23' }
        }
      );

      setStep(2);
      setCountdown(60); // Đếm ngược 60s mới cho gửi lại
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đã xảy ra lỗi, thử lại!');
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2: Xác nhận OTP + đặt mật khẩu mới ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { toast.warning('Vui lòng nhập đủ 6 chữ số!'); return; }
    if (!password || !confirmPassword) { toast.warning('Vui lòng nhập mật khẩu mới!'); return; }
    if (password !== confirmPassword) { toast.error('Mật khẩu xác nhận không khớp!'); return; }
    if (password.length < 6) { toast.error('Mật khẩu phải có ít nhất 6 ký tự!'); return; }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email, otp, password, confirmPassword
      });
      toast.success('Đặt lại mật khẩu thành công!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn!');
    } finally {
      setLoading(false);
    }
  };

  /* ── Gửi lại OTP ── */
  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      const otpCode = res.data.otp;
      setOtp('');
      toast.info(
        <div style={{ fontFamily: 'sans-serif' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#555' }}>Mã mới của bạn là:</p>
          <p style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 900, letterSpacing: 6, color: '#8c6b23' }}>
            {otpCode}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#999' }}>Hết hạn sau 10 phút</p>
        </div>,
        { position: 'top-right', autoClose: 30000, closeOnClick: false, pauseOnHover: true, style: { minWidth: 240, borderLeft: '4px solid #8c6b23' } }
      );
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi khi gửi lại OTP!');
    } finally {
      setLoading(false);
    }
  };

  /* ── Độ mạnh mật khẩu ── */
  const getStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.length >= 10) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    if (s <= 1) return { level: 1, label: 'Rất yếu', color: 'bg-red-500' };
    if (s === 2) return { level: 2, label: 'Yếu', color: 'bg-orange-400' };
    if (s === 3) return { level: 3, label: 'Trung bình', color: 'bg-yellow-400' };
    if (s === 4) return { level: 4, label: 'Mạnh', color: 'bg-blue-500' };
    return { level: 5, label: 'Rất mạnh', color: 'bg-green-500' };
  };
  const strength = getStrength(password);

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Toast hiện ở top-right */}
      <ToastContainer position="top-right" />

      {/* ═══ CỘT TRÁI: Hình ảnh + bước hướng dẫn ═══ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-in-out"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f] via-[#0b142f]/60 to-transparent" />
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <div className="mb-4 flex items-center gap-1 text-yellow-400 text-lg">{'★'.repeat(5)}</div>
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Khôi phục<br />tài khoản của bạn
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 max-w-md">
            Chỉ cần 3 bước đơn giản để lấy lại quyền truy cập vào tài khoản Sơn Quân Hotel.
          </p>

          {/* Các bước — active theo step hiện tại */}
          <div className="space-y-3">
            {[
              { num: 1, text: 'Nhập email đã đăng ký' },
              { num: 2, text: 'Nhập mã OTP nhận được' },
              { num: 3, text: 'Tạo mật khẩu mới' }
            ].map(item => (
              <div key={item.num} className="flex items-center gap-4">
                <span className={`text-xs font-black w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  step > item.num
                    ? 'bg-green-500 text-white'
                    : step === item.num
                      ? 'bg-[#8c6b23] text-white shadow-lg shadow-[#8c6b23]/40'
                      : 'bg-white/10 text-white/40'
                }`}>
                  {step > item.num ? '✓' : `0${item.num}`}
                </span>
                <span className={`text-sm font-medium transition-colors ${step >= item.num ? 'text-white' : 'text-white/40'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CỘT PHẢI: Form ═══ */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <Link
          to="/login"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-500 hover:text-[#8c6b23] font-bold transition-colors"
        >
          <FiArrowLeft size={16} /> Quay lại đăng nhập
        </Link>

        {/* Progress bar mini */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#8c6b23] to-[#b38d38] transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          />
        </div>

        <div className="w-full max-w-md mt-6 lg:mt-0">

          {/* ══════════ BƯỚC 1: NHẬP EMAIL ══════════ */}
          {step === 1 && (
            <>
              <div className="mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8c6b23] to-[#b38d38] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8c6b23]/30">
                  <FiMail size={28} className="text-white" />
                </div>
                <h2 className="text-4xl font-black text-[#0b142f] mb-3">Quên mật khẩu?</h2>
                <p className="text-gray-500 leading-relaxed">
                  Nhập email đã đăng ký. Mã xác nhận <strong>6 chữ số</strong> sẽ hiện ngay ở góc phải màn hình.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Địa chỉ email</label>
                  <div className="relative group">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors" size={20} />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 outline-none focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  id="send-otp-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white font-bold py-4 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#8c6b23]/30 disabled:opacity-60"
                >
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Đang xử lý...</>
                  ) : (
                    <><MdOutlinePassword size={20} /> Gửi mã xác nhận</>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Nhớ ra mật khẩu?{' '}
                  <Link to="/login" className="text-[#8c6b23] font-bold hover:underline">Đăng nhập</Link>
                </p>
                <p className="text-sm text-gray-500">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-[#8c6b23] font-bold hover:underline">Đăng ký ngay</Link>
                </p>
              </div>
            </>
          )}

          {/* ══════════ BƯỚC 2: NHẬP OTP + MẬT KHẨU MỚI ══════════ */}
          {step === 2 && (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#8c6b23] to-[#b38d38] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#8c6b23]/30">
                  <FiShield size={28} className="text-white" />
                </div>
                <h2 className="text-4xl font-black text-[#0b142f] mb-2">Xác nhận OTP</h2>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Mã <strong>6 chữ số</strong> đang hiển thị ở góc trên bên phải màn hình. Nhập mã và tạo mật khẩu mới bên dưới.
                </p>
              </div>

              {/* Thông tin email + nút gửi lại */}
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
                <div>
                  <p className="text-xs text-amber-600 font-medium">Mã gửi cho</p>
                  <p className="text-sm font-bold text-amber-800">{email}</p>
                </div>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#8c6b23] hover:underline disabled:text-gray-400 disabled:no-underline transition-colors"
                >
                  <FiRefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                  {countdown > 0 ? `Gửi lại (${countdown}s)` : 'Gửi lại mã'}
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* OTP 6 ô */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-3">Mã xác nhận OTP</label>
                  <OtpInput value={otp} onChange={setOtp} />
                  {otp.length === 6 && (
                    <p className="text-center text-xs text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
                      <FiCheckCircle size={12} /> Đã nhập đủ mã
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">Mật khẩu mới</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Mật khẩu mới</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors" size={20} />
                    <input
                      id="new-password"
                      type={showPass ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-[#8c6b23] focus:bg-white focus:ring-4 focus:ring-[#8c6b23]/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c6b23] transition-colors">
                      {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${strength.level <= 2 ? 'text-red-500' : strength.level === 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8c6b23] transition-colors" size={20} />
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className={`w-full bg-gray-50 border rounded-xl pl-12 pr-12 py-3.5 outline-none transition-all focus:ring-4 ${
                        confirmPassword
                          ? password === confirmPassword
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-100'
                            : 'border-red-400 focus:border-red-400 focus:ring-red-100'
                          : 'border-gray-200 focus:border-[#8c6b23] focus:ring-[#8c6b23]/10 focus:bg-white'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8c6b23] transition-colors">
                      {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                    {confirmPassword && (
                      <div className={`absolute right-11 top-1/2 -translate-y-1/2 ${password === confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                        <FiCheckCircle size={16} />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  id="reset-pass-btn"
                  type="submit"
                  disabled={loading || otp.length < 6 || !password || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-[#0b142f] to-[#1a2a50] text-white font-bold py-4 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Đang xử lý...</>
                  ) : (
                    <><FiShield size={18} /> Đặt lại mật khẩu</>
                  )}
                </button>

                <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="w-full text-sm text-gray-500 hover:text-[#8c6b23] font-medium transition-colors py-1">
                  ← Đổi email khác
                </button>
              </form>
            </>
          )}

          {/* ══════════ BƯỚC 3: THÀNH CÔNG ══════════ */}
          {step === 3 && (
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-8">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-200">
                  <FiCheckCircle size={46} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-black text-[#0b142f] mb-3">Thành công! 🎉</h2>
              <p className="text-gray-500 mb-2 leading-relaxed">
                Mật khẩu của bạn đã được cập nhật thành công.
              </p>
              <p className="text-sm text-gray-400 mb-8">
                Tự động chuyển về trang đăng nhập sau <strong>3 giây</strong>...
              </p>
              {/* Progress countdown */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8c6b23] to-[#b38d38] rounded-full"
                  style={{ width: '100%', animation: 'shrinkWidth 3s linear forwards' }}
                />
              </div>
              <style>{`@keyframes shrinkWidth { from { width: 100% } to { width: 0% } }`}</style>
              <Link
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-[#8c6b23] to-[#b38d38] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#8c6b23]/30"
              >
                Đăng nhập ngay →
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
