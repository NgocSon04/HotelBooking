import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiGift, FiChevronLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyOffers = () => {
  const navigate = useNavigate();
  const [savedOffers, setSavedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error("Vui lòng đăng nhập để xem khuyến mãi!");
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchSavedOffers(parsedUser.id);
  }, [navigate]);

  const fetchSavedOffers = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}/saved-offers`);
      setSavedOffers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải ưu đãi đã lưu:", error);
      toast.error("Không thể tải danh sách ưu đãi đã lưu!");
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã sao chép mã: ${code}`);
  };

  const handleRemoveOffer = async (offerId) => {
    if (window.confirm("Bạn có muốn gỡ ưu đãi này khỏi danh sách đã lưu?")) {
      try {
        await axios.post(`http://localhost:5000/api/users/${user.id}/remove-offer`, { offerId });
        setSavedOffers(prev => prev.filter(offer => offer._id !== offerId));
        toast.success("Đã gỡ mã giảm giá!");
      } catch (error) {
        toast.error("Không thể gỡ mã giảm giá!");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      <ToastContainer position="bottom-right" />
      
      {/* Mini Breadcrumb Banner */}
      <div className="bg-[#0b142f] text-white py-12 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/offers')} 
              className="text-[#facc15] text-sm font-bold flex items-center gap-1 hover:underline mb-2"
            >
              <FiChevronLeft /> Trở về trang ưu đãi
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiGift className="text-[#facc15]" /> Khuyến mãi của bạn
            </h1>
            <p className="text-gray-400 text-sm mt-1">Danh sách mã giảm giá và ưu đãi đặc quyền bạn đã lưu lại.</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Đang tải danh sách khuyến mãi...</div>
        ) : savedOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border max-w-lg mx-auto">
            <div className="w-16 h-16 bg-yellow-50 text-[#8c6b23] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              🎁
            </div>
            <h3 className="text-xl font-bold text-[#0b142f] mb-2">Bạn chưa lưu mã giảm giá nào</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Hãy ghé qua trang ưu đãi của khách sạn Sơn Quân để tìm kiếm và lưu lại những mã giảm giá, combo độc quyền tốt nhất.
            </p>
            <button 
              onClick={() => navigate('/offers')}
              className="bg-[#8c6b23] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7a5c1e] transition shadow-md"
            >
              Khám phá Ưu đãi ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOffers.map(offer => (
              <div 
                key={offer._id} 
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {offer.category}
                    </span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-bold">
                      {offer.discountType === 'percentage' ? `Giảm ${offer.discountValue}%` : `Giảm ${offer.discountValue?.toLocaleString('vi-VN')} đ`}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#0b142f] mb-2">{offer.title}</h3>
                  <p className="text-gray-500 text-xs mb-6 line-clamp-3">{offer.description}</p>
                </div>

                <div>
                  {offer.promoCode && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-2.5 flex justify-between items-center mb-4 bg-gray-50/50">
                      <span className="font-mono font-bold tracking-widest text-[#0b142f] text-sm">{offer.promoCode}</span>
                      <button 
                        onClick={() => handleCopyCode(offer.promoCode)}
                        className="text-[#8c6b23] text-xs font-bold hover:underline"
                      >
                        Sao chép
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleRemoveOffer(offer._id)}
                      className="bg-gray-100 text-gray-500 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
                      title="Gỡ bỏ khỏi danh sách đã lưu"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <button 
                      onClick={() => navigate('/rooms')}
                      className="flex-1 bg-[#0b142f] text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition text-xs"
                    >
                      Sử dụng ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOffers;
