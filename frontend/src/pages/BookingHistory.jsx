import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiX, FiCalendar, FiUsers, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tất cả');
  
  // State để quản lý Modal Xem chi tiết
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(storedUser);
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/user/${user.id}`);
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')} Thg ${date.getMonth() + 1}, ${date.getFullYear()}`;
  };

  const calculateNights = (checkIn, checkOut) => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalSpent = bookings
    .filter(bk => bk.status !== 'Đã hủy')
    .reduce((sum, bk) => sum + (bk.totalPrice || 0), 0);

  const filteredBookings = filter === 'Tất cả' 
    ? bookings 
    : bookings.filter(bk => {
        if (filter === 'Đã check-in') return bk.status === 'Đang lưu trú' || bk.status === 'Đã trả phòng';
        return bk.status === filter;
      });

  const filterOptions = ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã check-in', 'Đã hủy'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-sans bg-gray-50 min-h-screen relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b142f] mb-2">Lịch sử đặt phòng</h1>
        <p className="text-gray-500">Theo dõi và quản lý các kỳ nghỉ của bạn tại Sơn Quân Hotel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ================= BỘ LỌC ================= */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Bộ lọc</h3>
            <ul className="space-y-4">
              {filterOptions.map(option => (
                <li key={option} className="flex items-center gap-3 cursor-pointer group" onClick={() => setFilter(option)}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${filter === option ? 'border-[#8c6b23]' : 'border-gray-300 group-hover:border-[#8c6b23]'}`}>
                    {filter === option && <div className="w-2 h-2 bg-[#8c6b23] rounded-full"></div>}
                  </div>
                  <span className={`text-sm ${filter === option ? 'font-bold text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{option}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0b142f] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
            <FiStar className="absolute -bottom-6 -right-6 text-9xl text-white/10" />
            <div className="relative z-10">
              <p className="text-sm text-gray-300 mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-bold mb-4">{totalSpent.toLocaleString('vi-VN')} đ</p>
              <div className="flex items-center gap-2 text-sm font-medium bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <FiStar className="text-[#facc15]" />
                Hạng thành viên: <span className="text-[#facc15]">Vàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DANH SÁCH BOOKING ================= */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Đang tải lịch sử...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <p className="text-gray-500">Không có giao dịch nào ở trạng thái này.</p>
            </div>
          ) : (
            filteredBookings.map((bk) => {
              const isCancelled = bk.status === 'Đã hủy';
              let badgeStyle = "bg-gray-100 text-gray-600";
              let statusText = bk.status;
              let dotColor = "bg-gray-400";

              if (bk.status === 'Đã xác nhận') { badgeStyle = "bg-green-100 text-green-700"; dotColor = "bg-green-500"; }
              else if (bk.status === 'Chờ xác nhận') { badgeStyle = "bg-yellow-100 text-yellow-700"; dotColor = "bg-yellow-500"; }
              else if (bk.status === 'Đang lưu trú' || bk.status === 'Đã trả phòng') { badgeStyle = "bg-blue-100 text-blue-700"; statusText = 'Đã check-in'; dotColor = "bg-blue-500"; }

              const roomImage = bk.room?.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

              return (
                <div key={bk._id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row transition ${isCancelled ? 'opacity-70 grayscale bg-gray-50' : 'hover:shadow-md'}`}>
                  <div className="md:w-1/3 relative h-48 md:h-auto border-r border-gray-100">
                    <img src={roomImage} alt="Room" className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm ${isCancelled ? 'bg-white text-gray-500' : badgeStyle}`}>
                        {!isCancelled && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mr-1.5`}></span>}
                        {statusText}
                      </span>
                    </div>
                  </div>

                  <div className="md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-xl font-bold ${isCancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {bk.room?.roomName || 'Phòng không xác định'}
                        </h3>
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded">Mã: {bk.bookingCode}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                          <p className="text-gray-500 flex items-center gap-1 mb-1"><span className="text-[10px]">ĐẾN</span> Nhận phòng</p>
                          <p className="font-bold text-gray-800">{formatDate(bk.checkIn)}</p>
                          <p className="text-gray-500 text-xs">14:00</p>
                        </div>
                        <div>
                          <p className="text-gray-500 flex items-center gap-1 mb-1"><span className="text-[10px]">ĐI</span> Trả phòng</p>
                          <p className="font-bold text-gray-800">{formatDate(bk.checkOut)}</p>
                          <p className="text-gray-500 text-xs">12:00</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Tổng tiền</p>
                        <p className={`text-xl font-bold ${isCancelled ? 'text-gray-400' : 'text-[#8c6b23]'}`}>
                          {bk.totalPrice?.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                      
                      {/* ==== NÚT XEM CHI TIẾT KÍCH HOẠT MODAL ==== */}
                      <button 
                        onClick={() => setSelectedBooking(bk)}
                        className={`px-5 py-2 text-sm font-bold rounded-lg border transition ${isCancelled ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed hover:bg-gray-100' : 'border-[#8c6b23] text-[#8c6b23] hover:bg-yellow-50'}`}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ================= MODAL CHI TIẾT ĐẶT PHÒNG ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-[#0b142f]">Chi tiết Đặt phòng</h2>
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* Box 1: Mã & Trạng thái */}
              <div className="flex justify-between items-center mb-6 bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                <div>
                  <p className="text-sm text-gray-500">Mã Booking</p>
                  <p className="text-lg font-bold text-[#8c6b23]">{selectedBooking.bookingCode}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className={`font-bold ${selectedBooking.status === 'Đã hủy' ? 'text-red-500' : 'text-green-600'} flex items-center gap-1 justify-end`}>
                    {selectedBooking.status !== 'Đã hủy' && <FiCheckCircle />} {selectedBooking.status}
                  </p>
                </div>
              </div>

              {/* Box 2: Thông tin phòng */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img 
                  src={selectedBooking.room?.images?.[0] || 'https://via.placeholder.com/400x300'} 
                  alt="Room" 
                  className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" 
                />
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-gray-900">{selectedBooking.room?.roomName}</h3>
                  <p className="text-gray-500 text-sm">{selectedBooking.room?.type || 'Phòng cao cấp'}</p>
                </div>
              </div>

              {/* Box 3: Chi tiết lịch trình & Khách */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCalendar className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Nhận phòng</p>
                      <p className="font-bold text-gray-800">{formatDate(selectedBooking.checkIn)}</p>
                      <p className="text-sm text-gray-500">Từ 14:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCalendar className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Trả phòng</p>
                      <p className="font-bold text-gray-800">{formatDate(selectedBooking.checkOut)}</p>
                      <p className="text-sm text-gray-500">Trước 12:00</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiUsers className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Số lượng khách</p>
                      <p className="font-bold text-gray-800">{selectedBooking.guests} người lớn</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiCalendar className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Thời gian lưu trú</p>
                      <p className="font-bold text-gray-800">{calculateNights(selectedBooking.checkIn, selectedBooking.checkOut)} đêm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 4: Thanh toán */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-2"><FiCreditCard /> Phương thức thanh toán</span>
                  <span className="font-bold text-gray-800">{selectedBooking.paymentMethod || 'Tiền mặt'}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-bold">Tổng thanh toán</span>
                  <span className="text-2xl font-bold text-[#0b142f]">
                    {selectedBooking.totalPrice?.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>
              
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BookingHistory;