import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSave, FiUploadCloud, FiMail, FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    hotelName: '',
    slogan: '',
    shortDescription: '',
    email: '',
    phone: '',
    address: '',
    paymentCash: true,
    paymentBankTransfer: true,
    theme: 'light'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Lỗi tải dữ liệu cài đặt');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/settings', formData);
      toast.success('Lưu thay đổi thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thay đổi!');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải cấu hình hệ thống...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <ToastContainer position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các cấu hình cốt lõi và thông tin hiển thị của khách sạn.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
            Hủy
          </button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-6 py-2 bg-[#8c6b23] text-white font-bold rounded-lg hover:bg-[#7a5c1e] transition shadow-sm flex items-center gap-2"
          >
            <FiSave />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Cấu hình chung + Cấu hình thanh toán */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cấu hình chung */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-[#8c6b23]">🏢</span> Cấu hình chung
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Logo upload (Static for now) */}
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo khách sạn</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition bg-gray-50/50 h-40">
                  <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3">
                    <FiUploadCloud size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Tải ảnh lên</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 2MB</p>
                </div>
              </div>

              {/* Form chung */}
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tên khách sạn <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Slogan / Khẩu hiệu</label>
                  <input 
                    type="text" 
                    name="slogan"
                    value={formData.slogan}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả ngắn</label>
                  <textarea 
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Cấu hình thanh toán */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-[#8c6b23]">💳</span> Cấu hình thanh toán
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                    <span className="font-bold">💵</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Thanh toán tiền mặt</h3>
                    <p className="text-xs text-gray-500">Thanh toán trực tiếp tại quầy lễ tân</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="paymentCash" checked={formData.paymentCash} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-blue-100 rounded-xl bg-blue-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="font-bold">🏦</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Chuyển khoản ngân hàng</h3>
                    <p className="text-xs text-gray-500">Cổng thanh toán VNPay, Momo...</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="paymentBankTransfer" checked={formData.paymentBankTransfer} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Thông tin liên hệ + Giao diện hệ thống */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Thông tin liên hệ */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-[#8c6b23]">📞</span> Thông tin liên hệ
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email hỗ trợ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại Hotline</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ trụ sở</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[#8c6b23] focus:ring-1 focus:ring-[#8c6b23] transition"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Giao diện hệ thống */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-[#8c6b23]">🎨</span> Giao diện hệ thống
            </h2>
            <p className="text-sm text-gray-500 mb-4">Chọn giao diện mặc định cho trang quản trị.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, theme: 'light'})}
                className={`border-2 rounded-xl p-2 cursor-pointer transition ${formData.theme === 'light' ? 'border-[#8c6b23] bg-yellow-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="bg-white border rounded-lg h-24 mb-2 flex flex-col">
                  <div className="h-4 border-b flex items-center px-2"><div className="w-12 h-1 bg-gray-200 rounded"></div></div>
                  <div className="flex-1 flex p-2 gap-2">
                    <div className="w-1/4 h-full bg-gray-100 rounded"></div>
                    <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-200"></div>
                  </div>
                </div>
                <div className="text-center text-sm font-bold text-gray-700 flex items-center justify-center gap-1">
                  {formData.theme === 'light' && <FiCheck className="text-[#8c6b23]" />} Sáng
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, theme: 'dark'})}
                className={`border-2 rounded-xl p-2 cursor-pointer transition ${formData.theme === 'dark' ? 'border-[#8c6b23] bg-yellow-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="bg-gray-800 border-gray-700 border rounded-lg h-24 mb-2 flex flex-col">
                  <div className="h-4 border-b border-gray-700 flex items-center px-2"><div className="w-12 h-1 bg-gray-600 rounded"></div></div>
                  <div className="flex-1 flex p-2 gap-2">
                    <div className="w-1/4 h-full bg-gray-700 rounded"></div>
                    <div className="flex-1 bg-gray-900 rounded border border-dashed border-gray-700"></div>
                  </div>
                </div>
                <div className="text-center text-sm font-bold text-gray-700 flex items-center justify-center gap-1">
                  {formData.theme === 'dark' && <FiCheck className="text-[#8c6b23]" />} Tối
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
