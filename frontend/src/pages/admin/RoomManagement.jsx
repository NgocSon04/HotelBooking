import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // 1. THÊM CÁC TRƯỜNG MỚI VÀO STATE
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: 'Deluxe King',
    price: '',
    quantity: 5,
    size: '',
    capacity: '',
    bedType: '',
    description: '',
    amenities: '' // Sẽ nhập dưới dạng chuỗi: "Wifi, Tivi, Bồn tắm"
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải danh sách phòng!");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        setImageFiles(files);
        const previews = files.map(file => URL.createObjectURL(file)); 
        setImagePreviews(previews);
    }
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setFormData({ 
      roomName: '', roomType: 'Deluxe King', price: '', quantity: 5,
      size: '', capacity: '', bedType: '', description: '', amenities: '' 
    });
    setImageFiles([]);
    setImagePreviews([]);
    setIsModalOpen(true);
  };

  const handleEditClick = (room) => {
    setEditingId(room._id);
    setFormData({
      roomName: room.roomName,
      roomType: room.roomType,
      price: room.price,
      quantity: room.quantity || 5,
      size: room.size || '',
      capacity: room.capacity || '',
      bedType: room.bedType || '',
      description: room.description || '',
      // Chuyển mảng tiện ích từ Database thành chuỗi để hiển thị lên input
      amenities: room.amenities ? room.amenities.join(', ') : ''
    });
    setImageFiles([]);
    setImagePreviews(room.images || []);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => setDeleteModal({ isOpen: true, id: id });

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${deleteModal.id}`);
      setRooms(rooms.filter(room => room._id !== deleteModal.id));
      toast.success("Đã xóa phòng thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa phòng!");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('roomName', formData.roomName);
    formDataToSend.append('roomType', formData.roomType);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('quantity', formData.quantity);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('capacity', formData.capacity);
    formDataToSend.append('bedType', formData.bedType);
    formDataToSend.append('description', formData.description);

    // 2. TÁCH CHUỖI TIỆN ÍCH THÀNH MẢNG VÀ GỬI ĐI
    if (formData.amenities) {
      const ams = formData.amenities.split(',').map(item => item.trim()).filter(item => item !== '');
      ams.forEach(item => {
        formDataToSend.append('amenities', item);
      });
    }

    if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach(file => {
            formDataToSend.append('images', file);
        });
    }

    try {
      if (editingId) {
        const response = await axios.put(`http://localhost:5000/api/rooms/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setRooms(rooms.map(room => (room._id === editingId ? response.data : room)));
        toast.success("Cập nhật phòng thành công!");
      } else {
        const response = await axios.post('http://localhost:5000/api/rooms', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setRooms([...rooms, response.data]);
        toast.success("Đã thêm phòng thành công!");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu phòng!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách phòng</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các thông số chi tiết của phòng.</p>
        </div>
        <button onClick={handleOpenAddForm} className="flex items-center gap-2 bg-[#8c6b23] text-white px-4 py-2 rounded-lg hover:bg-[#7a5c1e] transition">
          <FiPlus /> Thêm phòng mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên phòng</th>
              <th className="p-4">Loại phòng</th>
              <th className="p-4">Giá (VND)</th>
              <th className="p-4">Số lượng</th>
              <th className="p-4">Chi tiết</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : rooms.map((room) => (
              <tr key={room._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-4">
                  <img src={(room.images && room.images.length > 0) ? room.images[0] : "https://via.placeholder.com/80x50"} alt="room" className="w-16 h-10 object-cover rounded border" />
                </td>
                <td className="p-4 font-medium text-gray-700">{room.roomName}</td>
                <td className="p-4 text-gray-500">{room.roomType}</td>
                <td className="p-4 text-gray-700 font-bold">{Number(room.price).toLocaleString('vi-VN')}</td>
                <td className="p-4 font-bold text-blue-600">{room.quantity || 5} phòng</td>
                <td className="p-4 text-sm text-gray-500">
                  {room.size}m² • {room.capacity} khách
                </td>
                <td className="p-4 flex gap-3 text-gray-400">
                  <button onClick={() => handleEditClick(room)} className="hover:text-blue-600 transition"><FiEdit size={18} /></button>
                  <button onClick={() => handleDeleteClick(room._id)} className="hover:text-red-600 transition"><FiTrash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL XÁC NHẬN XÓA ================= */}
      {deleteModal.isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Xóa giữ nguyên... */}
            <div className="bg-white w-[400px] rounded-xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận xóa phòng</h3>
              <p className="text-gray-500 text-sm mb-6">Hành động này sẽ không thể hoàn tác.</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="px-6 py-2 border rounded-lg">Hủy</button>
                <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg">Xóa</button>
              </div>
            </div>
         </div>
      )}

      {/* ================= MODAL FORM THÊM/SỬA PHÒNG RỘNG HƠN ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Mở rộng w-[800px] và thêm scrollbar nếu màn hình nhỏ */}
          <div className="bg-white w-full max-w-[800px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
              {editingId ? 'Cập nhật chi tiết phòng' : 'Thêm phòng mới'}
            </h2>

            <form onSubmit={handleSubmitForm} className="space-y-5">
              
              {/* HÀNG 1: Tên phòng & Loại phòng */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tên/Số phòng *</label>
                  <input type="text" name="roomName" required value={formData.roomName} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: Phòng 101" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Loại phòng</label>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none">
                    <option value="Phòng Tiêu Chuẩn">Phòng Tiêu Chuẩn</option>
                    <option value="Phòng Cao Cấp (Deluxe)">Phòng Cao Cấp (Deluxe)</option>
                    <option value="Suite">Suite</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>

              {/* HÀNG 2: Giá & Trạng thái */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Giá mỗi đêm (VND) *</label>
                  <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: 1500000" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Số lượng phòng hiện có</label>
                  <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: 5" />
                </div>
              </div>

              {/* HÀNG 3: Diện tích & Số khách */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Diện tích (m²)</label>
                  <input type="number" name="size" value={formData.size} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: 35" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Số khách tối đa</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: 2" />
                </div>
              </div>

              {/* HÀNG 4: Loại giường & Tiện ích */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Loại giường</label>
                  <input type="text" name="bedType" value={formData.bedType} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: 1 Giường King, 2 Giường đơn..." />
                </div>
                <div className="flex-[2]">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tiện nghi (Cách nhau bằng dấu phẩy)</label>
                  <input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="VD: Wifi miễn phí, Bồn tắm, Ban công hướng biển..." />
                </div>
              </div>

              {/* HÀNG 5: Mô tả chi tiết */}
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả giới thiệu phòng</label>
                 <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#8c6b23] outline-none" placeholder="Nhập bài viết giới thiệu không gian phòng..."></textarea>
              </div>

              {/* HÀNG 6: Upload Ảnh */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Bộ sưu tập ảnh phòng</label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.length > 0 ? (
                      imagePreviews.map((src, index) => (
                        <div key={index} className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white text-gray-400 text-xs">Chưa có ảnh</div>
                    )}
                  </div>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-[#8c6b23] file:text-white cursor-pointer" />
                </div>
              </div>

              {/* NÚT SUBMIT */}
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Hủy bỏ</button>
                <button type="submit" className="px-6 py-2.5 bg-[#8c6b23] text-white rounded-lg hover:bg-[#7a5c1e] font-bold shadow-md">
                  {editingId ? 'Lưu cập nhật' : 'Tạo phòng mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;