import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheckCircle, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Gói Combo',
    promoCode: '',
    priceText: '',
    tag: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/offers/admin');
      setOffers(res.data);
    } catch (err) { toast.error("Lỗi tải danh sách ưu đãi!"); }
  };

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingId(offer._id);
      setFormData({ 
        title: offer.title, 
        description: offer.description, 
        category: offer.category, 
        promoCode: offer.promoCode || '', 
        priceText: offer.priceText || '', 
        tag: offer.tag || '', 
        isActive: offer.isActive 
      });
      setPreview(offer.image);
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', category: 'Gói Combo', promoCode: '', priceText: '', tag: '', isActive: true });
      setPreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ưu đãi này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/offers/${id}`);
        toast.success("Xóa thành công!");
        fetchOffers();
      } catch (err) { toast.error("Lỗi khi xóa!"); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) return toast.warning("Vui lòng nhập Tiêu đề ưu đãi!");
    if (!formData.description.trim()) return toast.warning("Vui lòng nhập Mô tả!");
    if (formData.category === 'Mã giảm giá' && !formData.promoCode.trim()) return toast.warning("Vui lòng nhập Mã giảm giá!");
    if (formData.category === 'Gói Combo' && !formData.priceText.trim()) return toast.warning("Vui lòng nhập Giá Combo!");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/offers/${editingId}`, data);
        toast.success("Cập nhật thành công!");
      } else {
        await axios.post('http://localhost:5000/api/offers', data);
        toast.success("Thêm ưu đãi thành công!");
      }
      setIsModalOpen(false);
      fetchOffers();
    } catch (err) { toast.error("Lỗi khi lưu ưu đãi!"); }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Ưu đãi & Combo</h1>
        <button onClick={() => handleOpenModal()} className="bg-[#8c6b23] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a5c1e] transition">
          <FiPlus /> Thêm ưu đãi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-500">
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tiêu đề</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Thông tin thêm</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer._id} className={`border-b hover:bg-gray-50 ${!offer.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="p-4">
                  {offer.image ? <img src={offer.image} alt="offer" className="w-16 h-12 object-cover rounded shadow-sm" /> : <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>}
                </td>
                <td className="p-4 font-bold text-[#0b142f] max-w-[200px] truncate">{offer.title}</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">{offer.category}</span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {offer.promoCode && <div>Mã: <span className="font-bold">{offer.promoCode}</span></div>}
                  {offer.priceText && <div>Giá: <span className="font-bold text-yellow-600">{offer.priceText}</span></div>}
                </td>
                <td className="p-4 text-center">
                  {offer.isActive ? <span className="text-green-600 flex justify-center"><FiCheckCircle size={20}/></span> : <span className="text-gray-400 flex justify-center"><FiEyeOff size={20}/></span>}
                </td>
                <td className="p-4 flex justify-center gap-3 text-gray-400 mt-2">
                  <button onClick={() => handleOpenModal(offer)} className="hover:text-blue-600 transition"><FiEdit size={18} /></button>
                  <button onClick={() => handleDelete(offer._id)} className="hover:text-red-600 transition"><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
            <h2 className="text-xl font-bold mb-6 text-[#0b142f]">{editingId ? 'Sửa ưu đãi' : 'Thêm ưu đãi mới'}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold mb-1 block">Tiêu đề <span className="text-red-500">*</span></label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#8c6b23]" />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold mb-1 block">Danh mục <span className="text-red-500">*</span></label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#8c6b23] bg-white">
                  <option>Gói Combo</option>
                  <option>Mã giảm giá</option>
                  <option>Ưu đãi VIP</option>
                </select>
              </div>

              {/* RENDER CÓ ĐIỀU KIỆN DỰA VÀO DANH MỤC */}
              {formData.category === 'Mã giảm giá' && (
                <div className="col-span-2 md:col-span-1">
                  <label className="text-sm font-bold mb-1 block text-blue-600">Nhập mã giảm giá <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.promoCode} onChange={e => setFormData({...formData, promoCode: e.target.value.toUpperCase()})} placeholder="VD: SUMMER2024" className="w-full border border-blue-300 rounded-lg p-2.5 outline-none focus:border-blue-500 uppercase font-bold" />
                </div>
              )}

              {formData.category === 'Gói Combo' && (
                <div className="col-span-2 md:col-span-1">
                  <label className="text-sm font-bold mb-1 block text-yellow-600">Giá hiển thị (chữ) <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.priceText} onChange={e => setFormData({...formData, priceText: e.target.value})} placeholder="VD: chỉ từ 4.500.000đ" className="w-full border border-yellow-300 rounded-lg p-2.5 outline-none focus:border-yellow-500" />
                </div>
              )}

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold mb-1 block">Tag nổi bật (Tùy chọn)</label>
                <input type="text" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} placeholder="VD: MÙA HÈ RỰC RỠ" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#8c6b23]" />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-bold mb-1 block">Mô tả chi tiết <span className="text-red-500">*</span></label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#8c6b23]"></textarea>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-bold mb-1 block">Ảnh đại diện</label>
                <input type="file" onChange={e => {setImageFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0]))}} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-[#8c6b23] hover:file:bg-yellow-100" />
                {preview && <img src={preview} alt="Preview" className="mt-3 h-24 w-40 object-cover rounded-lg shadow-md" />}
              </div>

              <div className="col-span-2 md:col-span-1 flex items-center mt-6">
                <label className="flex items-center cursor-pointer gap-2">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-[#8c6b23] rounded border-gray-300 focus:ring-[#8c6b23]" />
                  <span className="text-sm font-bold text-gray-700">Hiển thị trên trang web</span>
                </label>
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Hủy</button>
                <button type="submit" className="px-6 py-2.5 bg-[#8c6b23] text-white rounded-lg font-bold hover:bg-[#7a5c1e] transition shadow-md">Lưu ưu đãi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManagement;