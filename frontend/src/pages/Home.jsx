import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiMapPin, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';
import { FaSpa, FaUtensils, FaSwimmer, FaRegStar } from 'react-icons/fa';

const heroImages = [
  "https://images.unsplash.com/photo-1542314831-c6a4d2748610?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop"
];

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setFeaturedRooms(response.data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi tải phòng:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (error) {
        console.error("Lỗi tải dịch vụ:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchRooms();
    fetchServices();
  }, []);

  // Hàm chọn icon dựa theo loại hoặc tên dịch vụ
  const getServiceIcon = (type, name) => {
    const n = name.toLowerCase();
    if (n.includes('spa') || type === 'Spa') return <FaSpa size={24} className="text-[#a18042]" />;
    if (n.includes('buffet') || n.includes('ẩm thực') || type === 'Ẩm thực') return <FaUtensils size={24} className="text-[#a18042]" />;
    if (n.includes('bơi') || type === 'Tiện ích') return <FaSwimmer size={24} className="text-[#a18042]" />;
    return <FaRegStar size={24} className="text-[#a18042]" />;
  };

  return (
    <div className="bg-[#f9fafb] font-sans">
      {/* ================= HEADER BANNERS & SEARCH ================= */}
      <div 
        className="relative h-[650px] bg-cover bg-center flex flex-col justify-center items-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${heroImages[currentBg]}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Tiêu đề */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mt-[-80px]">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide drop-shadow-md">
            Trải nghiệm kỳ nghỉ thượng lưu tại Sơn Quân Hotel
          </h1>
          <p className="text-lg md:text-xl font-light text-gray-100 drop-shadow">
            Nơi sự sang trọng hòa quyện cùng phong cách phục vụ đẳng cấp, mang đến cho bạn những khoảnh khắc khó quên.
          </p>
        </div>

        {/* Khung Tìm Kiếm Mới (Đè lên ảnh) */}
        <div className="absolute bottom-[-40px] z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 flex flex-col md:flex-row items-center gap-4 w-[95%] max-w-5xl border border-gray-100">
          <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">
            <label className="block text-xs font-bold text-gray-800 mb-2">Địa điểm</label>
            <div className="flex items-center text-gray-500 bg-gray-50/50 rounded-lg p-2">
              <FiMapPin className="mr-2 text-gray-400" /> 
              <input type="text" placeholder="Bạn muốn đến đâu?" className="outline-none w-full bg-transparent text-sm text-gray-700 font-medium placeholder-gray-400" />
            </div>
          </div>
          <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">
            <label className="block text-xs font-bold text-gray-800 mb-2">Ngày nhận</label>
            <div className="flex items-center text-gray-500 bg-gray-50/50 rounded-lg p-2">
              <FiCalendar className="mr-2 text-gray-400" /> 
              <input type="text" placeholder="dd/mm/yyyy" className="outline-none w-full bg-transparent text-sm text-gray-700 font-medium placeholder-gray-400" />
            </div>
          </div>
          <div className="flex-1 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200 w-full">
            <label className="block text-xs font-bold text-gray-800 mb-2">Ngày trả</label>
            <div className="flex items-center text-gray-500 bg-gray-50/50 rounded-lg p-2">
              <FiCalendar className="mr-2 text-gray-400" /> 
              <input type="text" placeholder="dd/mm/yyyy" className="outline-none w-full bg-transparent text-sm text-gray-700 font-medium placeholder-gray-400" />
            </div>
          </div>
          <div className="flex-1 px-4 py-2 w-full">
            <label className="block text-xs font-bold text-gray-800 mb-2">Khách</label>
            <div className="flex items-center text-gray-500 bg-gray-50/50 rounded-lg p-2">
              <FiUsers className="mr-2 text-gray-400" /> 
              <input type="text" placeholder="2 Người lớn, 0 Trẻ em" className="outline-none w-full bg-transparent text-sm text-gray-700 font-medium placeholder-gray-400" />
            </div>
          </div>
          <div className="px-4 py-2 w-full md:w-auto mt-4 md:mt-0">
            <button className="w-full md:w-auto bg-[#8c6b23] text-white px-8 py-4 rounded-xl hover:bg-[#7a5c1e] transition-colors flex items-center justify-center font-bold text-sm shadow-lg shadow-[#8c6b23]/30">
              <FiSearch className="mr-2" /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Khoảng trống để bù đắp cho thẻ search bị đẩy xuống */}
      <div className="h-16 md:h-24"></div>

      {/* ================= DANH SÁCH PHÒNG NỔI BẬT ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#0b142f]">Phòng Nổi Bật</h2>
            <p className="text-gray-500 mt-2 text-sm">Trải nghiệm không gian lưu trú sang trọng bậc nhất</p>
          </div>
          <Link to="/rooms" className="text-[#8c6b23] hover:text-[#7a5c1e] font-bold text-sm flex items-center gap-1 transition-colors">
            Xem tất cả <span className="text-lg">→</span>
          </Link>
        </div>

        {loadingRooms ? (
          <div className="text-center py-20 text-gray-500">Đang tải danh sách phòng...</div>
        ) : featuredRooms.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Chưa có phòng nào được cập nhật.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            {/* Ảnh lớn bên trái */}
            {featuredRooms[0] && (
              <Link 
                to={`/rooms/details/${featuredRooms[0]._id}`} 
                className="lg:col-span-2 relative group rounded-2xl overflow-hidden shadow-lg h-[400px] lg:h-full block"
              >
                <img 
                  src={(featuredRooms[0].images && featuredRooms[0].images.length > 0) ? featuredRooms[0].images[0] : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000"} 
                  alt={featuredRooms[0].roomName} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f]/90 via-[#0b142f]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end">
                  <div className="text-white w-2/3">
                    <div className="flex text-yellow-400 text-sm mb-2">
                      {'★'.repeat(Math.round(featuredRooms[0].rating || 5))}
                    </div>
                    <h3 className="text-3xl font-bold mb-2 text-white">{featuredRooms[0].roomName}</h3>
                    <p className="text-sm text-gray-300">
                      {featuredRooms[0].size || 50}m² • {featuredRooms[0].bedType || '1 giường lớn'} • {featuredRooms[0].amenities?.slice(0,2).join(' • ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-300 mb-1">Từ</p>
                    <p className="text-2xl font-bold text-white tracking-wide">
                      {Number(featuredRooms[0].price).toLocaleString('vi-VN')} VNĐ<span className="text-sm font-normal text-gray-300">/đêm</span>
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* 2 Ảnh nhỏ bên phải */}
            <div className="flex flex-col gap-6 h-[800px] lg:h-full">
              {featuredRooms.slice(1, 3).map((room) => (
                <Link 
                  to={`/rooms/details/${room._id}`} 
                  key={room._id} 
                  className="flex-1 relative group rounded-2xl overflow-hidden shadow-lg block"
                >
                  <img 
                    src={(room.images && room.images.length > 0) ? room.images[0] : "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000"} 
                    alt={room.roomName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b142f]/90 via-[#0b142f]/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold mb-1 text-white">{room.roomName}</h3>
                    <p className="text-lg font-bold text-gray-200">
                      {Number(room.price).toLocaleString('vi-VN')} VNĐ<span className="text-xs font-normal text-gray-400">/đêm</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= DỊCH VỤ TIỆN ÍCH ĐẲNG CẤP ================= */}
      <div className="bg-[#f0f2f5] py-20 mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0b142f] mb-4">Dịch Vụ Tiện Ích Đẳng Cấp</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Tận hưởng trọn vẹn từng khoảnh khắc với hệ thống dịch vụ 5 sao được thiết kế riêng cho sự thoải mái của bạn.
            </p>
          </div>

          {loadingServices ? (
            <div className="text-center text-gray-500">Đang tải dịch vụ...</div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500">Chưa có dịch vụ nào.</div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${services.length > 4 ? 4 : services.length} gap-8`}>
              {services.slice(0, 4).map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto bg-[#fff8e7] rounded-full flex items-center justify-center mb-6">
                    {getServiceIcon(service.type, service.serviceName)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.serviceName}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;
