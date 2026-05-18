import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    type: 'Tiện ích',
    price: '',
    operatingHours: '',
    tag: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) { 
      toast.error("Lỗi tải dữ liệu!"); 
    }
  };

  const handleOpenModal = (svc = null) => {
    if (svc) {
      setEditingId(svc._id);
      setFormData({ ...svc });
      setPreview(svc.image);
    } else {
      setEditingId(null);
      setFormData({ serviceName: '', type: 'Tiện ích', price: '', operatingHours: '', tag: '', description: '' });
      setPreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // 1. VALIDATE DỮ LIỆU ĐẦU VÀO (CHỐNG LỖI 400)
    // ==========================================
    if (!formData.serviceName || !formData.serviceName.trim()) {
      return toast.warning("Vui lòng nhập Tên dịch vụ!");
    }
    if (!formData.price || !formData.price.trim()) {
      return toast.warning("Vui lòng nhập Giá dịch vụ!");
    }
    if (!formData.description || !formData.description.trim()) {
      return toast.warning("Vui lòng nhập Mô tả ngắn!");
    }
    
    // Yêu cầu bắt buộc phải có ảnh khi THÊM MỚI
    if (!editingId && !imageFile) {
      return toast.warning("Vui lòng tải lên Ảnh đại diện cho dịch vụ!");
    }

    // ==========================================
    // 2. GỬI DỮ LIỆU LÊN SERVER
    // ==========================================
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/services/${editingId}`, data);
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        await axios.post('http://localhost:5000/api/services', data);
        toast.success("Thêm dịch vụ mới thành công!");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err) { 
      console.error("Lỗi từ Backend:", err.response?.data);
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi lưu dữ liệu!"); 
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
        <button onClick={() => handleOpenModal()} className="bg-[#8c6b23] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a5c1e]">
          <FiPlus /> Thêm dịch vụ
        </button>
      </div>

      {/* Table Danh sách */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-500">
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên dịch vụ</th>
              <th className="p-4">Loại</th>
              <th className="p-4">Giờ hoạt động</th>
              <th className="p-4">Giá tham khảo</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc._id} className="border-b hover:bg-gray-50">
                <td className="p-4"><img src={svc.image} alt="Dịch vụ" className="w-12 h-12 object-cover rounded shadow-sm" /></td>
                <td className="p-4 font-medium">{svc.serviceName}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{svc.type}</span></td>
                <td className="p-4 text-gray-500 text-sm">{svc.operatingHours}</td>
                <td className="p-4 font-semibold text-gray-700">{svc.price}</td>
                <td className="p-4 flex justify-center gap-3 text-gray-400">
                  <button onClick={() => handleOpenModal(svc)} className="hover:text-blue-600"><FiEdit /></button>
                  <button className="hover:text-red-600"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-sm font-bold mb-1 block">Tên dịch vụ <span className="text-red-500">*</span></label>
                <input type="text" value={formData.serviceName} onChange={e => setFormData({...formData, serviceName: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:border-[#8c6b23]" />
              </div>
              <div className="col-span-1">
                <label className="text-sm font-bold mb-1 block">Loại dịch vụ <span className="text-red-500">*</span></label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border rounded-lg p-2 outline-none">
                  <option>Ẩm thực</option>
                  <option>Spa</option>
                  <option>Tiện ích</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-sm font-bold mb-1 block">Giá (Kèm đơn vị) <span className="text-red-500">*</span></label>
                <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg p-2 outline-none" placeholder="VD: 1.200.000 VNĐ / Khách" />
              </div>
              <div className="col-span-1">
                <label className="text-sm font-bold mb-1 block">Giờ hoạt động</label>
                <input type="text" value={formData.operatingHours} onChange={e => setFormData({...formData, operatingHours: e.target.value})} className="w-full border rounded-lg p-2 outline-none" placeholder="VD: 06:00 - 22:30" />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold mb-1 block">Ảnh dịch vụ {!editingId && <span className="text-red-500">*</span>}</label>
                <input type="file" onChange={e => {setImageFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))}} className="text-sm" />
                {preview && <img src={preview} alt="Preview" className="mt-2 h-20 w-32 object-cover rounded" />}
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold mb-1 block">Mô tả ngắn <span className="text-red-500">*</span></label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full border rounded-lg p-2 outline-none"></textarea>
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-[#8c6b23] text-white rounded-lg font-bold hover:bg-[#7a5c1e]">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;