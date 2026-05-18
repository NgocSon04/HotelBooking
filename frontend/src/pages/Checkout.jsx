import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiUser, FiCreditCard, FiLock, FiStar } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequest: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán sau');
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu được truyền từ trang RoomDetails
  const bookingData = location.state;

  useEffect(() => {
    // Nếu không có dữ liệu (user truy cập trực tiếp url /checkout), đẩy về trang chủ
    if (!bookingData || !bookingData.room) {
      navigate('/');
      return;
    }

    // Load user info from localStorage if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        // Tách First Name và Last Name tạm thời từ Full Name
        firstName: user.fullName ? user.fullName.split(' ').slice(1).join(' ') : '',
        lastName: user.fullName ? user.fullName.split(' ')[0] : '',
      }));
    }
  }, [bookingData, navigate]);

  if (!bookingData) return null;

  const { room, checkIn, checkOut, guests, nights, totalRoomPrice, serviceFee, tax, grandTotal } = bookingData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckout = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng!");
      return;
    }

    setLoading(true);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        user: user ? user.id : null, // Nếu cần bắt buộc đăng nhập, ta sẽ kiểm tra trước
        room: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        totalPrice: grandTotal,
        paymentMethod,
        specialRequest: formData.specialRequest,
        customerInfo: { // Gửi kèm thông tin nhập ở form
           firstName: formData.firstName,
           lastName: formData.lastName,
           email: formData.email,
           phone: formData.phone
        }
      });
      
      toast.success("🎉 Đặt phòng thành công! Hệ thống đang chờ xác nhận.");
      setTimeout(() => navigate('/history'), 2000); 
    } catch (error) {
       toast.error(error.response?.data?.message || "Lỗi khi đặt phòng! Vui lòng thử lại sau.");
    } finally {
       setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()} Th${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20">
      <ToastContainer position="top-right" />
      
      {/* Header thanh toán */}
      <header className="bg-white py-4 px-8 border-b border-gray-200 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-[#8c6b23] flex items-center gap-2 tracking-wide">
          <span className="text-xl">🏢</span> Sơn Quân Hotel
        </Link>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-600 hover:text-black flex items-center gap-2 transition">
          <FiArrowLeft /> Trở về tìm kiếm
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-10 max-w-xl mx-auto">
           <div className="flex flex-col items-center">
             <div className="w-8 h-8 rounded-full bg-[#0b142f] text-white flex items-center justify-center font-bold text-sm shadow-md">
                <FiUser />
             </div>
             <span className="text-xs font-bold text-[#0b142f] mt-2">Thông tin</span>
           </div>
           <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
           <div className="flex flex-col items-center">
             <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
                <FiCreditCard />
             </div>
             <span className="text-xs font-bold text-gray-400 mt-2">Thanh toán</span>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="flex-1 space-y-6">
            
            {/* 1. Thông tin khách hàng */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <span className="text-[#8c6b23]">🎫</span> 1. Thông tin khách hàng
               </h2>
               
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên đệm <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} 
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition" 
                      placeholder="Nguyễn Văn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tên <span className="text-red-500">*</span></label>
                    <input 
                      type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} 
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition" 
                      placeholder="A"
                    />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleInputChange} 
                      className="w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition" 
                      placeholder="nguyenvana@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-2">Xác nhận đặt phòng sẽ được gửi qua email này.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                    <div className="flex">
                       <div className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-lg text-gray-600 font-medium">+84</div>
                       <input 
                         type="text" name="phone" value={formData.phone} onChange={handleInputChange} 
                         className="flex-1 border border-gray-200 bg-gray-50/50 rounded-r-lg px-4 py-3 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition" 
                         placeholder="090 123 4567"
                       />
                    </div>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Yêu cầu đặc biệt (Không bắt buộc)</label>
                 <textarea 
                   name="specialRequest" value={formData.specialRequest} onChange={handleInputChange} rows="3"
                   className="w-full border border-gray-200 bg-gray-50/50 rounded-lg px-4 py-3 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                   placeholder="Ví dụ: Phòng tầng cao, yêu cầu nôi trẻ em..."
                 ></textarea>
               </div>
            </div>

            {/* 2. Phương thức thanh toán */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
               <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                 <span className="text-[#8c6b23]">💳</span> 2. Phương thức thanh toán
               </h2>

               <div className="grid grid-cols-3 gap-4 mb-8">
                  <div 
                    onClick={() => setPaymentMethod('Thẻ ngân hàng')}
                    className={`border rounded-xl p-4 cursor-pointer text-center transition-all ${paymentMethod === 'Thẻ ngân hàng' ? 'border-[#8c6b23] bg-yellow-50/30 ring-1 ring-[#8c6b23]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-2 flex justify-center text-gray-700">💳</div>
                    <div className="font-bold text-gray-800 text-sm">Thẻ Ngân Hàng</div>
                    <div className="text-xs text-gray-500 mt-1">Visa, Master, JCB</div>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('Ví điện tử')}
                    className={`border rounded-xl p-4 cursor-pointer text-center transition-all ${paymentMethod === 'Ví điện tử' ? 'border-[#8c6b23] bg-yellow-50/30 ring-1 ring-[#8c6b23]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-2 flex justify-center text-gray-700">📱</div>
                    <div className="font-bold text-gray-800 text-sm">Ví Điện Tử</div>
                    <div className="text-xs text-gray-500 mt-1">Momo, ZaloPay, VNPay</div>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('Thanh toán sau')}
                    className={`border rounded-xl p-4 cursor-pointer text-center transition-all ${paymentMethod === 'Thanh toán sau' ? 'border-[#8c6b23] bg-yellow-50/30 ring-1 ring-[#8c6b23]' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-2xl mb-2 flex justify-center text-gray-700">💵</div>
                    <div className="font-bold text-gray-800 text-sm">Thanh toán sau</div>
                    <div className="text-xs text-gray-500 mt-1">Tiền mặt tại quầy lễ tân</div>
                  </div>
               </div>

               {/* Nếu chọn thẻ ngân hàng (UI Mockup) */}
               {paymentMethod === 'Thẻ ngân hàng' && (
                 <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fade-in-up">
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-2">Số thẻ</label>
                      <div className="relative">
                        <FiCreditCard className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input type="text" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 outline-none" placeholder="0000 0000 0000 0000" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Ngày hết hạn</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Mã CVV</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none" placeholder="123" />
                      </div>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="w-full lg:w-[400px]">
             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
                
                {/* Hình ảnh phòng */}
                <div className="h-48 relative">
                   <img src={(room.images && room.images.length > 0) ? room.images[0] : "https://images.unsplash.com/photo-1542314831-c6a4d2748610"} alt="Room" className="w-full h-full object-cover" />
                   <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                     <FiStar className="text-yellow-500" /> {room.rating || '5.0'}
                   </div>
                </div>

                <div className="p-6">
                   <h3 className="text-xl font-bold text-gray-900 mb-1">{room.roomName}</h3>
                   <p className="text-sm text-gray-500 flex items-center gap-1 mb-6">
                     <span className="text-[#8c6b23]">📍</span> View toàn cảnh thành phố
                   </p>

                   {/* Check In / Out Box */}
                   <div className="bg-gray-50 rounded-xl p-4 flex justify-between mb-6 border border-gray-100">
                      <div>
                         <p className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1 mb-1">
                           <span className="text-[#8c6b23]">➜</span> Nhận phòng
                         </p>
                         <p className="font-bold text-gray-800">{formatDate(checkIn)}</p>
                         <p className="text-xs text-gray-500">14:00</p>
                      </div>
                      <div className="w-px bg-gray-300 mx-2"></div>
                      <div>
                         <p className="text-[10px] uppercase font-bold text-gray-500 flex items-center gap-1 mb-1">
                           <span className="text-[#8c6b23]">➜</span> Trả phòng
                         </p>
                         <p className="font-bold text-gray-800">{formatDate(checkOut)}</p>
                         <p className="text-xs text-gray-500">12:00</p>
                      </div>
                   </div>

                   {/* Room Info */}
                   <div className="flex gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100 font-medium">
                      <div className="flex items-center gap-2">🛏️ {room.bedType || '1 Giường King'}</div>
                      <div className="flex items-center gap-2">👥 {guests} Người lớn</div>
                   </div>

                   {/* Price Breakdown */}
                   <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6 border-dashed">
                      <div className="flex justify-between font-medium">
                         <span>Giá phòng ({nights} đêm)</span>
                         <span className="font-bold text-gray-800">{totalRoomPrice.toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between font-medium">
                         <span>Thuế & Phí dịch vụ (15%)</span>
                         <span className="font-bold text-gray-800">{(serviceFee + tax).toLocaleString('vi-VN')} đ</span>
                      </div>
                      <div className="flex justify-between text-[#8c6b23] font-medium">
                         <span><FiStar className="inline mr-1"/> Ưu đãi thành viên</span>
                         <span className="font-bold">- 0 đ</span>
                      </div>
                   </div>

                   {/* Total */}
                   <div className="flex justify-between items-end mb-8">
                      <div>
                         <p className="text-lg font-bold text-gray-900 leading-none">Tổng cộng</p>
                         <p className="text-xs text-gray-500 mt-1">Đã bao gồm thuế</p>
                      </div>
                      <div className="text-2xl font-bold text-[#8c6b23]">{grandTotal.toLocaleString('vi-VN')} đ</div>
                   </div>

                   {/* Button */}
                   <button 
                     onClick={handleCheckout}
                     disabled={loading}
                     className="w-full bg-[#8c6b23] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#7a5c1e] transition shadow-lg shadow-[#8c6b23]/30 flex items-center justify-center gap-2"
                   >
                     {loading ? 'Đang xử lý...' : <><FiLock /> Thanh toán an toàn</>}
                   </button>
                   <p className="text-center text-xs text-gray-400 mt-4 flex justify-center items-center gap-1">
                     <FiLock /> Thông tin được bảo mật qua chuẩn SSL
                   </p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
