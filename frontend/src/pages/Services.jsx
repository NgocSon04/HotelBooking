import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiClock, FiTag, FiWind, FiBriefcase } from 'react-icons/fi';
import { BiRestaurant, BiDumbbell, BiSpa, BiSwim } from 'react-icons/bi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải danh sách dịch vụ:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Hàm hỗ trợ render Icon tự động dựa trên tên loại dịch vụ
  const renderIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'ẩm thực': return <BiRestaurant className="text-xl text-[#8c6b23]" />;
      case 'spa': return <BiSpa className="text-xl text-[#0b142f]" />;
      case 'tiện ích': return <BiDumbbell className="text-xl text-gray-500" />;
      default: return <BiSwim className="text-xl text-[#8c6b23]" />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans pb-20">
      {/* ================= HERO BANNER ================= */}
      <div 
        className="relative h-[450px] bg-cover bg-center flex flex-col justify-center items-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000')" }}
      >
        <div className="absolute inset-0 bg-[#0b142f]/60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">Dịch Vụ Đẳng Cấp</h1>
          <p className="text-base md:text-lg font-light max-w-2xl mx-auto">
            Nâng tầm trải nghiệm nghỉ dưỡng của bạn với những tiện ích chuẩn quốc tế, từ ẩm thực tinh hoa đến không gian thư giãn tuyệt đối.
          </p>
        </div>
      </div>

      {/* ================= DANH SÁCH DỊCH VỤ DYNAMIC GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Đang tải dữ liệu dịch vụ...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, index) => {
              // LOGIC HIỂN THỊ DỰA VÀO INDEX (Để khớp với image_631fff.jpg)
              const pattern = index % 4;

              // 1. KIỂU THẺ NGANG (Chiếm 2 cột) - Ví dụ: Nhà hàng Michelin
              if (pattern === 0) {
                return (
                  <div key={svc._id} className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:shadow-lg transition">
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      <img src={svc.image} alt={svc.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {svc.tag && <span className="absolute top-4 left-4 bg-[#8c6b23] text-white text-xs font-bold px-3 py-1 rounded-full shadow">{svc.tag}</span>}
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">{svc.serviceName}</h3>
                          {renderIcon(svc.type)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">{svc.description}</p>
                        <div className="space-y-2 text-sm text-gray-500 mb-6">
                          {svc.operatingHours && <div className="flex items-center gap-2"><FiClock className="text-[#8c6b23]" /> {svc.operatingHours}</div>}
                          {svc.price && <div className="flex items-center gap-2"><FiTag className="text-[#8c6b23]" /> {svc.price}</div>}
                        </div>
                      </div>
                      <button className="w-full sm:w-auto bg-gradient-to-r from-[#b38d38] to-[#8c6b23] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition">
                        Đặt dịch vụ
                      </button>
                    </div>
                  </div>
                );
              }

              // 2. KIỂU THẺ DỌC NHỎ (Chiếm 1 cột) - Ví dụ: Gym hoặc Spa
              if (pattern === 1 || pattern === 2) {
                return (
                  <div key={svc._id} className="col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-lg transition">
                    <div className="h-56 relative overflow-hidden">
                      <img src={svc.image} alt={svc.serviceName} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      {svc.tag && <span className="absolute top-4 left-4 bg-white/90 text-[#0b142f] text-xs font-bold px-3 py-1 rounded-full shadow">{svc.tag}</span>}
                    </div>
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{svc.serviceName}</h3>
                          {renderIcon(svc.type)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{svc.description}</p>
                        <div className="space-y-2 text-sm text-gray-500 mb-6">
                          {svc.operatingHours && <div className="flex items-center gap-2"><FiClock /> {svc.operatingHours}</div>}
                          {svc.price && <div className="flex items-center gap-2"><FiTag /> {svc.price}</div>}
                        </div>
                      </div>
                      <button className={`w-full py-2.5 rounded-lg font-bold transition border ${
                        pattern === 1 
                        ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                        : 'bg-[#0b142f] text-white hover:bg-gray-800'
                      }`}>
                        {pattern === 1 ? 'Chi tiết' : 'Đặt liệu trình'}
                      </button>
                    </div>
                  </div>
                );
              }

              // 3. KIỂU THẺ ẢNH NỀN LỚN (Chiếm 2 cột) - Ví dụ: Hồ bơi vô cực
              if (pattern === 3) {
                return (
                  <div key={svc._id} className="md:col-span-2 rounded-2xl overflow-hidden relative group h-[400px] shadow-sm hover:shadow-lg transition">
                    <img src={svc.image} alt={svc.serviceName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f]/90 via-[#0b142f]/30 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                      <div className="text-white md:w-2/3">
                        {svc.tag && <span className="bg-[#8c6b23] text-xs font-bold px-3 py-1 rounded-full shadow mb-3 inline-block">{svc.tag}</span>}
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                          <FiWind className="text-[#8c6b23]" /> {svc.serviceName}
                        </h3>
                        <p className="text-gray-200 text-sm line-clamp-2">{svc.description}</p>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl md:min-w-[200px]">
                        {svc.operatingHours && <div className="text-white text-xs mb-3 font-medium">Giờ mở cửa: <br/>{svc.operatingHours}</div>}
                        <button className="w-full bg-[#8c6b23] text-white py-2 rounded-lg font-bold hover:bg-[#7a5c1e] transition text-sm shadow">
                          Đặt chỗ ngay
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* ================= TRẢI NGHIỆM CÁ NHÂN HÓA ================= */}
      <div className="bg-[#0b142f] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Trải nghiệm cá nhân hóa</h2>
          <p className="text-gray-400 mb-10 text-sm md:text-base">
            Đội ngũ Concierge chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ thiết kế những trải nghiệm riêng biệt theo sở thích của bạn.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition cursor-pointer shadow-sm">
              <FiClock className="text-[#8c6b23]" />
              <span className="text-sm font-medium">Phục vụ tại phòng 24/7</span>
            </div>
            <div className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition cursor-pointer shadow-sm">
              <FiBriefcase className="text-[#8c6b23]" />
              <span className="text-sm font-medium">Đưa đón sân bay hạng sang</span>
            </div>
            <div className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition cursor-pointer shadow-sm">
              <FiTag className="text-[#8c6b23]" />
              <span className="text-sm font-medium">Tổ chức sự kiện riêng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;