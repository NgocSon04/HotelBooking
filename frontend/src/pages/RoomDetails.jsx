import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiWifi, FiTv, FiWind, FiCoffee, FiStar, FiHeart, FiShare2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(0);



  const serviceFeeRate = 0.05;
  const taxRate = 0.10;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchRoomDetails();
  }, [id]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = date2.getTime() - date1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  if (loading) return <div className="text-center py-20 text-xl text-gray-600">Đang tải thông tin phòng...</div>;
  if (!room) return <div className="text-center py-20 text-xl text-red-600">Không tìm thấy phòng!</div>;

  const basePrice = Number(room.price) || 0;
  const totalRoomPrice = basePrice * nights;
  const serviceFee = totalRoomPrice * serviceFeeRate;
  const tax = totalRoomPrice * taxRate;
  const grandTotal = totalRoomPrice + serviceFee + tax;

  const handleOpenLightbox = (index) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };
  const lightboxSlides = room.images ? room.images.map(img => ({ src: img })) : [];

  // ==========================================
  // HÀM 1: BẤM ĐẶT PHÒNG -> CHUYỂN TRANG CHECKOUT
  // ==========================================
  const handleBookingClick = () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.warning("Vui lòng đăng nhập để đặt phòng!");
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (nights <= 0) {
      return toast.warning("Vui lòng chọn ngày nhận và trả phòng hợp lệ!");
    }

    // Chuyển hướng sang trang Checkout kèm theo dữ liệu
    navigate('/checkout', { 
      state: { room, checkIn, checkOut, guests, nights, basePrice, totalRoomPrice, serviceFee, tax, grandTotal } 
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white font-sans">
      <ToastContainer position="bottom-right" />
      
      {/* ... (Các phần hiển thị Header và Gallery giữ nguyên không đổi) ... */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{room.roomName} - {room.roomType}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center text-yellow-500 font-bold"><FiStar className="mr-1" /> {room.rating || 5}</span>
            <span>({room.reviewsCount || 0} đánh giá)</span>
            <span>• Đà Nẵng, Việt Nam</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded transition"><FiShare2/> Chia sẻ</button>
          <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1 rounded transition"><FiHeart/> Lưu</button>
        </div>
      </div>

      <div className={`grid gap-2 mb-12 rounded-2xl overflow-hidden shadow-md h-[450px] 
        ${room.images?.length === 1 ? 'grid-cols-1' : 
          room.images?.length === 2 ? 'grid-cols-2' : 
          'grid-cols-4 grid-rows-2'}`}
      >
        {room.images?.length === 1 && (
          <div className="w-full h-full cursor-pointer" onClick={() => handleOpenLightbox(0)}>
            <img src={room.images[0]} alt="Room" className="w-full h-full object-cover hover:opacity-90 transition duration-300" />
          </div>
        )}

        {room.images?.length > 1 && (
          <>
            <div className={`${room.images.length > 2 ? 'col-span-2 row-span-2' : 'col-span-1'} relative cursor-pointer`} onClick={() => handleOpenLightbox(0)}>
              <img src={room.images[0]} alt="Main" className="w-full h-full object-cover hover:opacity-90 transition duration-300" />
            </div>
            {room.images.slice(1, 5).map((img, index) => (
              <div key={index} className="relative overflow-hidden cursor-pointer group" onClick={() => handleOpenLightbox(index + 1)}>
                <img src={img} alt={`Sub ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                {index === 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold hover:bg-black/60 transition shadow-inner">
                    <span className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/50">
                      Hiển thị tất cả ảnh
                    </span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={photoIndex} 
        slides={lightboxSlides} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="col-span-2 space-y-8">
          <div className="border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Toàn bộ phòng {room.roomType} cao cấp</h2>
            <p className="text-gray-600">{room.capacity || 2} khách • {room.bedType || '1 giường lớn'} • 1 phòng tắm riêng</p>
          </div>

          <div className="space-y-6 border-b pb-8">
            <h3 className="text-xl font-bold">Giới thiệu về không gian này</h3>
            <p className="text-gray-600 leading-relaxed text-justify whitespace-pre-line">
              {room.description || "Với diện tích rộng rãi lên đến 85m2, căn phòng được thiết kế tỉ mỉ kết hợp giữa phong cách kiến trúc hiện đại và những đường nét truyền thống..."}
            </p>
          </div>

          <div className="border-b pb-8">
            <h3 className="text-xl font-bold mb-6">Nơi này có những gì cho bạn</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              {room.amenities && room.amenities.length > 0 ? (
                room.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3"><FiStar className="text-xl text-[#8c6b23]"/> {item}</div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3"><FiWifi className="text-xl"/> Wifi tốc độ cao miễn phí</div>
                  <div className="flex items-center gap-3"><FiWind className="text-xl"/> Điều hòa trung tâm</div>
                  <div className="flex items-center gap-3"><FiTv className="text-xl"/> Smart TV 65"</div>
                  <div className="flex items-center gap-3"><FiCoffee className="text-xl"/> Máy pha cafe Espresso</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM TÍNH TIỀN */}
        <div className="relative">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="text-2xl font-bold text-gray-900 mb-6">
              {basePrice.toLocaleString('vi-VN')}đ <span className="text-base font-normal text-gray-500">/ đêm</span>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
              <div className="flex border-b border-gray-300">
                <div className="p-3 flex-1 border-r border-gray-300">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Nhận phòng</label>
                  <input 
                    type="date" 
                    min={today}
                    value={checkIn} 
                    onChange={e => setCheckIn(e.target.value)} 
                    className="w-full mt-1 outline-none text-sm text-gray-700 bg-transparent cursor-pointer" 
                  />
                </div>
                <div className="p-3 flex-1">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Trả phòng</label>
                  <input 
                    type="date" 
                    min={checkIn || today}
                    value={checkOut} 
                    onChange={e => setCheckOut(e.target.value)} 
                    className="w-full mt-1 outline-none text-sm text-gray-700 bg-transparent cursor-pointer" 
                  />
                </div>
              </div>
              <div className="p-3">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">Khách</label>
                <select 
                  value={guests} 
                  onChange={e => setGuests(e.target.value)} 
                  className="w-full mt-1 outline-none text-sm bg-transparent cursor-pointer"
                >
                  <option value={1}>1 người lớn</option>
                  <option value={2}>2 người lớn</option>
                  <option value={3}>3 người lớn</option>
                  <option value={4}>4 người lớn</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleBookingClick} 
              className="w-full bg-[#8c6b23] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#7a5c1e] transition mb-4 shadow-md"
            >
              Đặt phòng ngay
            </button>
            <p className="text-center text-sm text-gray-500 mb-6">Bạn chưa bị trừ tiền</p>

            {nights > 0 ? (
              <>
                <div className="space-y-3 text-gray-600 text-sm border-b pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>{basePrice.toLocaleString('vi-VN')}đ x {nights} đêm</span>
                    <span>{totalRoomPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline cursor-pointer">Phí dịch vụ (5%)</span>
                    <span>{serviceFee.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline cursor-pointer">Thuế VAT (10%)</span>
                    <span>{tax.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Tổng tiền</span>
                  <span>{grandTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-gray-400 mt-4 border-t pt-4">
                Vui lòng chọn ngày để xem chi tiết giá
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default RoomDetails;