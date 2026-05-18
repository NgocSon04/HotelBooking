import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ClientFooter = () => {
  const [settings, setSettings] = useState({
    hotelName: 'Sơn Quân Hotel',
    shortDescription: 'Mang đến trải nghiệm lưu trú đẳng cấp, kết hợp giữa sự vững chãi của truyền thống và tiện nghi hiện đại.',
    email: 'info@sonquanbooking.vn',
    phone: '+84 236 388 8888',
    address: '123 Đường Ngọc Trai, Quận Hải Châu, TP. Đà Nẵng'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/settings');
        if (response.data) {
          setSettings({
            hotelName: response.data.hotelName || 'Sơn Quân Hotel',
            shortDescription: response.data.shortDescription || 'Mang đến trải nghiệm lưu trú đẳng cấp, kết hợp giữa sự vững chãi của truyền thống và tiện nghi hiện đại.',
            email: response.data.email || 'info@sonquanbooking.vn',
            phone: response.data.phone || '+84 236 388 8888',
            address: response.data.address || '123 Đường Ngọc Trai, Quận Hải Châu, TP. Đà Nẵng'
          });
        }
      } catch (error) {
        console.error("Không thể tải cấu hình khách sạn", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer id="footer-contact" className="bg-[#f0f2f5] pt-16 pb-8 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{settings.hotelName}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{settings.shortDescription}</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Khám phá</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li><Link to="#" className="hover:text-[#8c6b23] transition-colors">Về chúng tôi</Link></li>
            <li><Link to="#" className="hover:text-[#8c6b23] transition-colors">Câu hỏi thường gặp</Link></li>
            <li><Link to="#" className="hover:text-[#8c6b23] transition-colors">Tuyển dụng</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Pháp lý</h4>
          <ul className="text-sm text-gray-500 space-y-2">
            <li><Link to="#" className="hover:text-[#8c6b23] transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="#" className="hover:text-[#8c6b23] transition-colors">Điều khoản sử dụng</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-4">Liên hệ</h4>
          <ul className="text-sm text-gray-500 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-[#8c6b23] mt-0.5">📍</span>
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8c6b23]">📞</span>
              <span>{settings.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#8c6b23]">✉️</span>
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400 pt-8 border-t border-gray-300">
        © {new Date().getFullYear()} {settings.hotelName}. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default ClientFooter;