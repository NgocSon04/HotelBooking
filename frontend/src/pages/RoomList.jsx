import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiCalendar, FiUsers, FiMaximize, FiGrid } from 'react-icons/fi';
import { MdOutlineKingBed } from 'react-icons/md';

const RoomList = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Bộ lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const typeParam = searchParams.get('type');
    return typeParam ? [typeParam] : [];
  });

  // Sync url param type to state
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedTypes([typeParam]);
    }
  }, [searchParams]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortOption, setSortOption] = useState('Phổ biến nhất');

  // Khai báo các tuỳ chọn bộ lọc (map với data thực tế từ DB)
  const typeMapping = {
    'Phòng Tiêu Chuẩn': 'Standard',
    'Phòng Cao Cấp (Deluxe)': 'Deluxe',
    'Suite': 'Suite',
    'Penthouse': 'Penthouse'
  };

  const amenitiesList = ['Ban công', 'Bồn tắm', 'Tầm nhìn biển', 'Giường King', 'Wifi'];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải danh sách phòng:", error);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Handlers
  const handleTypeChange = (typeKey) => {
    const dbType = typeMapping[typeKey];
    setSelectedTypes(prev => 
      prev.includes(dbType) ? prev.filter(t => t !== dbType) : [...prev, dbType]
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedRating(null);
    setSearchQuery('');
  };

  // Logic Lọc và Sắp xếp
  const filteredRooms = useMemo(() => {
    let result = rooms;

    // 1. Lọc theo Search Query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(room => 
        room.roomName.toLowerCase().includes(lowerQuery) || 
        (room.description && room.description.toLowerCase().includes(lowerQuery))
      );
    }

    // 2. Lọc theo Khoảng giá
    if (priceRange.min !== '') {
      result = result.filter(room => room.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(room => room.price <= Number(priceRange.max));
    }

    // 3. Lọc theo Loại phòng
    if (selectedTypes.length > 0) {
      result = result.filter(room => selectedTypes.includes(room.roomType));
    }

    // 4. Lọc theo Tiện nghi (Chứa TẤT CẢ tiện nghi được chọn)
    if (selectedAmenities.length > 0) {
      result = result.filter(room => {
        if (!room.amenities) return false;
        return selectedAmenities.every(a => 
           room.amenities.some(ra => ra.toLowerCase().includes(a.toLowerCase()))
        );
      });
    }

    // 5. Lọc theo Đánh giá
    if (selectedRating) {
      result = result.filter(room => (room.rating || 5) >= selectedRating);
    }

    // 6. Sắp xếp
    if (sortOption === 'Giá thấp nhất') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Giá cao nhất') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Phổ biến nhất: dựa vào số lượng reviews
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }, [rooms, searchQuery, priceRange, selectedTypes, selectedAmenities, selectedRating, sortOption]);

  if (loading) return <div className="text-center py-20 text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* THANH TÌM KIẾM TRÊN CÙNG */}
      <div className="bg-white border-b py-6 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
          <div className="flex-[2] relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên phòng, địa điểm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#8c6b23] outline-none transition" 
            />
          </div>
          <div className="flex-1 flex items-center bg-gray-50 border rounded-lg px-4 py-3 opacity-60 cursor-not-allowed">
            <FiCalendar className="mr-3 text-gray-400" />
            <span className="text-sm text-gray-600">Chọn ngày</span>
          </div>
          <div className="flex-1 flex items-center bg-gray-50 border rounded-lg px-4 py-3 opacity-60 cursor-not-allowed">
            <FiUsers className="mr-3 text-gray-400" />
            <span className="text-sm text-gray-600">Số khách</span>
          </div>
          <button className="bg-[#0b142f] text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md">Tìm kiếm</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR BỘ LỌC */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Bộ lọc</h2>
              <button onClick={clearFilters} className="text-xs font-bold text-[#8c6b23] hover:underline">Xóa tất cả</button>
            </div>

            {/* Lọc Giá */}
            <div className="mb-8">
              <h3 className="font-bold text-sm mb-4">Khoảng giá (VNĐ)</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Từ" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8c6b23]" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Đến" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[#8c6b23]" 
                />
              </div>
            </div>

            {/* Loại phòng */}
            <div className="mb-8 space-y-3">
              <h3 className="font-bold text-sm mb-4">Loại phòng</h3>
              {Object.keys(typeMapping).map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(typeMapping[type])}
                    onChange={() => handleTypeChange(type)}
                    className="w-4 h-4 rounded border-gray-300 text-[#8c6b23] focus:ring-[#8c6b23]" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>

            {/* Tiện nghi */}
            <div className="mb-8 space-y-3">
              <h3 className="font-bold text-sm mb-4">Tiện nghi</h3>
              {amenitiesList.map((ami) => (
                <label key={ami} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedAmenities.includes(ami)}
                    onChange={() => handleAmenityChange(ami)}
                    className="w-4 h-4 rounded border-gray-300 text-[#8c6b23] focus:ring-[#8c6b23]" 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{ami}</span>
                </label>
              ))}
            </div>

            {/* Đánh giá */}
            <div>
              <h3 className="font-bold text-sm mb-4">Đánh giá</h3>
              {[5, 4, 3].map((star) => (
                <label key={star} className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={selectedRating === star}
                    onChange={() => setSelectedRating(star)}
                    className="text-[#8c6b23] focus:ring-[#8c6b23]" 
                  />
                  <span className="text-yellow-400 flex text-lg leading-none">{'★'.repeat(star)}{'☆'.repeat(5-star)}</span>
                  <span className="text-xs text-gray-500">trở lên</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* DANH SÁCH PHÒNG */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Tìm thấy {filteredRooms.length} phòng phù hợp</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sắp xếp theo:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-sm font-bold border-none outline-none focus:ring-0 cursor-pointer"
              >
                <option value="Phổ biến nhất">Phổ biến nhất</option>
                <option value="Giá thấp nhất">Giá thấp nhất</option>
                <option value="Giá cao nhất">Giá cao nhất</option>
              </select>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy phòng nào</h3>
              <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              <button onClick={clearFilters} className="mt-6 bg-[#0b142f] text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRooms.map((room) => (
                <div key={room._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group flex flex-col">
                  {/* Ảnh phòng */}
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={(room.images && room.images.length > 0) ? room.images[0] : "https://images.unsplash.com/photo-1542314831-c6a4d2748610"} 
                      alt={room.roomName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {room.quantity <= 2 && (
                       <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                         Chỉ còn {room.quantity} phòng
                       </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                      <span className="text-yellow-500">★</span> {room.rating || '5.0'}
                    </div>
                  </div>

                  {/* Nội dung thẻ phòng */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{room.roomName}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
                      {room.description || "Tận hưởng tầm nhìn tuyệt đẹp ra đại dương với không gian sang trọng..."}
                    </p>

                    {/* Thông số kỹ thuật Icons */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-md font-medium">
                        <FiMaximize className="text-[#8c6b23]" /> {room.size || 35}m²
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-md font-medium">
                        <MdOutlineKingBed className="text-[#8c6b23]" /> {room.bedType || '1 Giường lớn'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs bg-gray-50 border border-gray-100 px-2 py-1.5 rounded-md font-medium">
                        <FiGrid className="text-[#8c6b23]" /> Tắm riêng
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-dashed border-gray-200 pt-5 mt-auto">
                      <div>
                        <p className="text-xs text-gray-400 line-through">{(room.price * 1.2).toLocaleString('vi-VN')} VNĐ</p>
                        <p className="text-xl font-black text-[#0b142f]">{Number(room.price).toLocaleString('vi-VN')}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">VNĐ / đêm</p>
                      </div>
                      <Link 
                        to={`/rooms/details/${room._id}`}
                        className="bg-[#8c6b23] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#7a5c1e] transition shadow-md shadow-[#8c6b23]/20"
                      >
                        Đặt ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Nút Xem thêm */}
          {filteredRooms.length > 0 && (
            <div className="mt-12 text-center">
              <button className="px-8 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#8c6b23] hover:text-[#8c6b23] transition">
                Tải thêm phòng
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoomList;