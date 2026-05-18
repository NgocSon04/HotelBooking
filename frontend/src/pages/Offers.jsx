import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCopy, FiArrowRight } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // Gọi API lấy dữ liệu
        const response = await axios.get('http://localhost:5000/api/offers');
        setOffers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải ưu đãi:", error);
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const categories = ['Tất cả', 'Gói Combo', 'Mã giảm giá', 'Ưu đãi VIP'];

  const filteredOffers = activeCategory === 'Tất cả' 
    ? offers 
    : offers.filter(offer => offer.category === activeCategory);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  return (
    <div className="bg-gray-50 font-sans pb-20">
      <ToastContainer position="bottom-right" />

      {/* ================= HERO BANNER ================= */}
      <div 
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b142f]/90 to-transparent"></div>
        <div className="relative z-10 text-white px-8 md:px-16 max-w-2xl">
          <span className="bg-[#8c6b23] text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Exclusive Offers</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide leading-tight">Ưu đãi đặc quyền</h1>
          <p className="text-base md:text-lg font-light mb-8 opacity-90">
            Khám phá những trải nghiệm nghỉ dưỡng đẳng cấp với các ưu đãi dành riêng cho thành viên của Sơn Quân Hotel.
          </p>
          <button className="bg-[#8c6b23] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#7a5c1e] transition shadow-lg">
            Xem ngay
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* ================= HEADER & FILTER ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-[#0b142f] mb-2">Danh mục ưu đãi</h2>
            <p className="text-gray-500">Chọn lọc những gói nghỉ dưỡng và dịch vụ tốt nhất cho bạn.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-[#facc15] text-[#0b142f] shadow-md' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= GRID DYNAMIC (KHỚP IMAGE) ================= */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải danh sách ưu đãi...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => {
              
              // 1. DÀNH CHO MÃ GIẢM GIÁ (Thẻ nền trắng, khung đứt khúc)
              if (offer.category === 'Mã giảm giá') {
                return (
                  <div key={offer._id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition flex flex-col justify-center">
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                      <FiCopy size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-[#0b142f] mb-3">{offer.title}</h3>
                    <p className="text-gray-500 text-sm mb-6">{offer.description}</p>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex justify-between items-center mb-6 bg-gray-50">
                      <span className="font-bold tracking-widest text-[#0b142f]">{offer.promoCode}</span>
                      <button 
                        onClick={() => handleCopyCode(offer.promoCode)}
                        className="text-[#8c6b23] text-sm font-bold hover:underline"
                      >
                        Sao chép
                      </button>
                    </div>
                    
                    <button className="w-full bg-[#0b142f] text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                      Sử dụng ngay
                    </button>
                  </div>
                );
              }

              // 2. DÀNH CHO GÓI COMBO NỔI BẬT (Thẻ lớn chiếm 2 cột - chỉ áp dụng cho item đầu tiên)
              if (index === 0 && offer.category === 'Gói Combo') {
                return (
                  <div key={offer._id} className="md:col-span-2 rounded-2xl overflow-hidden relative group min-h-[400px] shadow-sm hover:shadow-xl transition">
                    <img src={offer.image || "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1000"} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8">
                      <div className="flex gap-2 mb-3">
                        {offer.tag && <span className="bg-[#8c6b23] text-white text-xs font-bold px-3 py-1 rounded-full">{offer.tag}</span>}
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">COMBO BÁN CHẠY</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">{offer.title}</h3>
                      <p className="text-gray-200 text-sm mb-6 max-w-md">{offer.description}</p>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <span className="text-2xl font-bold text-[#facc15]">{offer.priceText}</span>
                        <button className="bg-white text-[#0b142f] px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                          Nhận ưu đãi ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // 3. DÀNH CHO CÁC THẺ ƯU ĐÃI NHỎ CÒN LẠI (Có ảnh nền, nội dung nằm trong hộp trắng)
              return (
                <div key={offer._id} className="rounded-2xl overflow-hidden relative group h-[400px] shadow-sm hover:shadow-lg transition">
                  <img src={offer.image || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000"} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  
                  {/* Hộp trắng nổi lên ở dưới cùng */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg transform group-hover:-translate-y-2 transition duration-300">
                    <h3 className="text-lg font-bold text-[#0b142f] mb-2">{offer.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{offer.description}</p>
                    <button className="text-[#0b142f] font-bold text-sm flex items-center gap-2 hover:text-[#8c6b23] transition">
                      Xem chi tiết <FiArrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= BANNER HỘI VIÊN DIAMOND ================= */}
        <div className="mt-16 bg-[#0b142f] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl">
          {/* Mảng màu trang trí */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 md:w-2/3">
            <h2 className="text-3xl font-bold text-white mb-4">Trở thành hội viên Diamond</h2>
            <p className="text-gray-300 mb-8 max-w-lg">
              Nhận ngay ưu đãi giảm 10% cho tất cả lần đặt phòng tiếp theo cùng hàng loạt dịch vụ đưa đón, check-in sớm miễn phí.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#8c6b23] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#7a5c1e] transition">
                Đăng ký ngay
              </button>
              <button className="bg-transparent border border-white/30 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
          
          {/* Graphic Thẻ Diamond */}
          <div className="relative z-10 hidden md:block">
            <div className="w-72 h-44 bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 shadow-2xl border border-gray-700/50 flex flex-col justify-between transform -rotate-6 hover:rotate-0 transition duration-500">
              <div className="flex justify-between items-start">
                <span className="text-[#8c6b23] font-bold tracking-widest text-sm">Sơn Quân</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8c6b23] to-yellow-500 opacity-80"></div>
              </div>
              <div>
                <p className="text-gray-400 text-xs tracking-widest mb-1">MEMBERSHIP CARD</p>
                <p className="text-white font-mono tracking-widest opacity-80">**** **** **** 8888</p>
                <p className="text-[#8c6b23] font-bold text-sm mt-3 tracking-widest">DIAMOND MEMBER</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Offers;