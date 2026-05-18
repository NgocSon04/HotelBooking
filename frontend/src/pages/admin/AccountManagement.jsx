import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  
  // State quản lý Modal Thêm/Sửa
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' hoặc 'edit'
  const [editId, setEditId] = useState(null);
  
  // State dữ liệu Form
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', role: 'Client', status: 'Hoạt động'
  });

  // Load danh sách user
  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) { toast.error("Lỗi tải danh sách tài khoản!"); }
  };

  // ==========================================
  // XỬ LÝ SỰ KIỆN: THÊM, SỬA, XÓA
  // ==========================================
  
  // Bấm nút Thêm
  const handleOpenAdd = () => {
    setModalMode('add');
    setFormData({ fullName: '', email: '', phone: '', password: '', role: 'Client', status: 'Hoạt động' });
    setShowModal(true);
  };

  // Bấm nút Sửa
  const handleOpenEdit = (user) => {
    setModalMode('edit');
    setEditId(user._id);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'Client',
      status: user.status || 'Hoạt động',
      password: '' // Không cho phép sửa password ở đây
    });
    setShowModal(true);
  };

  // Bấm nút Xóa
  const handleDelete = async (id) => {
    if(window.confirm('Cảnh báo: Bạn có chắc chắn muốn xóa tài khoản này vĩnh viễn?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        toast.success("Đã xóa tài khoản thành công!");
        fetchUsers();
      } catch (error) { toast.error("Lỗi khi xóa tài khoản!"); }
    }
  };

  // Submit Form (Dùng chung cho cả Thêm và Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        // GỌI API THÊM
        await axios.post('http://localhost:5000/api/users', formData);
        toast.success("Thêm tài khoản mới thành công!");
      } else {
        // GỌI API SỬA
        await axios.put(`http://localhost:5000/api/users/${editId}`, formData);
        toast.success("Cập nhật tài khoản thành công!");
      }
      setShowModal(false);
      fetchUsers(); // Tải lại bảng dữ liệu
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-6 font-sans">
      <ToastContainer position="bottom-right" />
      
      {/* Tiêu đề & Nút Thêm */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý tài khoản</h1>
          <p className="text-gray-500 text-sm">Quản lý phân quyền và trạng thái hoạt động của nhân viên, khách hàng.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-[#facc15] text-[#0b142f] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-500 transition shadow-md flex items-center gap-2"
        >
          <FiPlus /> Thêm tài khoản
        </button>
      </div>

      {/* Box thống kê */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 w-72 mb-6">
         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex justify-center items-center text-xl font-bold">👥</div>
         <div>
           <p className="text-gray-500 text-sm font-bold">Tổng tài khoản</p>
           <p className="text-2xl font-bold text-gray-900">{users.length}</p>
         </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-white flex">
           <div className="flex bg-gray-50 border rounded-lg px-3 py-2 w-80">
             <FiSearch className="text-gray-400 mt-1 mr-2"/>
             <input type="text" placeholder="Tìm kiếm tên, email, SĐT..." className="outline-none w-full text-sm bg-transparent"/>
           </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Avatar</th>
              <th className="p-4">Tên khách hàng</th>
              <th className="p-4">Email</th>
              <th className="p-4">Số điện thoại</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4">
                  <img src={user.avatar || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="avatar"/>
                </td>
                <td className="p-4 font-bold text-gray-800">{user.fullName || 'Chưa cập nhật'}</td>
                <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                <td className="p-4 text-gray-500 text-sm">{user.phone || '---'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'Admin' ? 'bg-gray-200 text-gray-700' : user.role === 'Staff' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.status === 'Hoạt động' ? (
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Hoạt động
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                      <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Đã khóa
                    </span>
                  )}
                </td>
                <td className="p-4 flex justify-center gap-4 text-gray-400">
                  <button onClick={() => handleOpenEdit(user)} title="Sửa" className="hover:text-blue-600 transition"><FiEdit size={18}/></button>
                  <button onClick={() => handleDelete(user._id)} title="Xóa" className="hover:text-red-600 transition"><FiTrash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* MODAL THÊM / SỬA TÀI KHOẢN                 */}
      {/* ========================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {modalMode === 'add' ? 'Thêm Tài Khoản Mới' : 'Cập Nhật Thông Tin'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><FiX size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]"/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input required disabled={modalMode === 'edit'} type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23] ${modalMode === 'edit' ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]"/>
                </div>
              </div>

              {/* Chỉ hiện ô Mật khẩu khi tạo mới (Add mode) */}
              {modalMode === 'add' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                  <input required minLength={6} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none focus:border-[#8c6b23]"/>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vai trò</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none cursor-pointer">
                    <option value="Client">Khách hàng (Client)</option>
                    <option value="Staff">Nhân viên (Staff)</option>
                    <option value="Admin">Quản trị viên (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border rounded-lg px-4 py-2 outline-none cursor-pointer">
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Đã khóa">Khóa tài khoản</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="w-1/2 py-2.5 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition">Hủy</button>
                <button type="submit" className="w-1/2 py-2.5 rounded-lg font-bold text-[#0b142f] bg-[#facc15] hover:bg-yellow-500 transition shadow-md">
                  {modalMode === 'add' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;