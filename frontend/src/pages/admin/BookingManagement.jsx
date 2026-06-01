import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiCheckCircle, FiXCircle, FiLogOut, FiLogIn } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingManagement = () => {
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' hoặc 'services'
  const [bookings, setBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery = '', setSearchQuery = () => {} } = useOutletContext() || {};
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Tải song song cả 2 nguồn dữ liệu
      const [resBookings, resServiceBookings] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings/admin'),
        axios.get('http://localhost:5000/api/service-bookings/admin')
      ]);
      setBookings(resBookings.data);
      setServiceBookings(resServiceBookings.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải dữ liệu từ máy chủ!");
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus });
      toast.success(`Đã duyệt đơn phòng thành công: ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleServiceStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/service-bookings/${id}/status`, { status: newStatus });
      toast.success(`Đã duyệt đơn dịch vụ thành công: ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  // Lọc dữ liệu phòng
  const filteredBookings = bookings.filter(bk => {
    const term = searchQuery.toLowerCase();
    const matchSearch = (
      bk.bookingCode?.toLowerCase().includes(term) ||
      bk.user?.fullName?.toLowerCase().includes(term) ||
      bk.user?.phone?.includes(term) ||
      bk.room?.roomName?.toLowerCase().includes(term)
    );
    const matchStatus = statusFilter === 'Tất cả' || bk.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Lọc dữ liệu dịch vụ
  const filteredServiceBookings = serviceBookings.filter(sb => {
    const term = searchQuery.toLowerCase();
    const matchSearch = (
      sb.bookingCode?.toLowerCase().includes(term) ||
      sb.user?.fullName?.toLowerCase().includes(term) ||
      sb.user?.phone?.includes(term) ||
      sb.service?.serviceName?.toLowerCase().includes(term)
    );
    const matchStatus = statusFilter === 'Tất cả' || sb.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Chờ xác nhận': return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>Chờ xác nhận</span>;
      case 'Đã xác nhận': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Đã xác nhận</span>;
      case 'Đang lưu trú': return <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>Đang lưu trú</span>;
      case 'Đã trả phòng': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Đã trả phòng</span>;
      case 'Đã hủy': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>Đã hủy</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const statusOptions = activeTab === 'rooms' 
    ? ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng', 'Đã hủy']
    : ['Tất cả', 'Chờ xác nhận', 'Đã xác nhận', 'Đã hủy'];

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* TIÊU ĐỀ */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đặt chỗ</h1>
          <p className="text-gray-500 text-sm">Phê duyệt và cập nhật trạng thái các giao dịch lưu trú & dịch vụ.</p>
        </div>
      </div>

      {/* CHUYỂN TAB TÁC VỤ */}
      <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-4 pt-2 shadow-sm border border-b-0">
        <button 
          onClick={() => { setActiveTab('rooms'); setStatusFilter('Tất cả'); }}
          className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'rooms' ? 'border-[#8c6b23] text-[#8c6b23]' : 'border-transparent text-gray-500 hover:text-[#8c6b23]'}`}
        >
          🏨 Đặt phòng ({bookings.length})
        </button>
        <button 
          onClick={() => { setActiveTab('services'); setStatusFilter('Tất cả'); }}
          className={`py-3 px-6 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${activeTab === 'services' ? 'border-[#8c6b23] text-[#8c6b23]' : 'border-transparent text-gray-500 hover:text-[#8c6b23]'}`}
        >
          ✨ Đặt dịch vụ ({serviceBookings.length})
        </button>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* THANH BỘ LỌC DỮ LIỆU */}
        <div className="p-4 border-b flex flex-wrap gap-4 bg-white items-center">
          <div className="flex bg-gray-50 border rounded-lg px-3 py-2 w-72">
            <FiSearch className="text-gray-400 mt-1 mr-2"/>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'rooms' ? "Tìm theo mã, tên khách, loại phòng..." : "Tìm theo mã, tên khách, dịch vụ..."} 
              className="outline-none w-full text-sm bg-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm outline-none bg-gray-50 text-gray-700 font-medium"
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button 
            onClick={fetchData}
            className="ml-auto flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Tải lại dữ liệu
          </button>
        </div>

        {/* BẢNG DỮ LIỆU */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Đang tải danh sách đặt chỗ...</div>
        ) : activeTab === 'rooms' ? (
          // ================= BẢNG ĐẶT PHÒNG =================
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Mã Booking</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Phòng đặt</th>
                  <th className="p-4">Ngày Nhận - Trả</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Phương thức</th>
                  <th className="p-4">Tổng tiền</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(bk => (
                  <tr key={bk._id} className="border-b hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-800">{bk.bookingCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#0b142f]">{bk.user?.fullName || bk.customerInfo?.lastName + ' ' + bk.customerInfo?.firstName}</div>
                      <div className="text-xs text-gray-500">{bk.user?.phone || bk.customerInfo?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#0b142f]">{bk.room?.roomName || 'Phòng đã xóa'}</div>
                      <div className="text-xs text-gray-500">{bk.room?.roomType}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      <div className="font-medium">{new Date(bk.checkIn).toLocaleDateString('vi-VN')}</div>
                      <div className="text-xs text-gray-400">đến {new Date(bk.checkOut).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="p-4">{renderStatusBadge(bk.status)}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border">
                        {bk.paymentMethod || 'Tiền mặt'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#8c6b23]">
                      {bk.totalPrice?.toLocaleString()} đ
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {bk.status === 'Chờ xác nhận' && (
                          <>
                            <button onClick={() => handleStatusChange(bk._id, 'Đã xác nhận')} title="Xác nhận đơn đặt" className="text-gray-400 hover:text-green-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiCheckCircle size={16}/></button>
                            <button onClick={() => handleStatusChange(bk._id, 'Đã hủy')} title="Hủy đơn đặt" className="text-gray-400 hover:text-red-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiXCircle size={16}/></button>
                          </>
                        )}
                        {bk.status === 'Đã xác nhận' && (
                          <button onClick={() => handleStatusChange(bk._id, 'Đang lưu trú')} title="Khách Check-in" className="text-gray-400 hover:text-blue-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiLogIn size={16}/></button>
                        )}
                        {bk.status === 'Đang lưu trú' && (
                          <button onClick={() => handleStatusChange(bk._id, 'Đã trả phòng')} title="Khách Check-out" className="text-gray-400 hover:text-green-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiLogOut size={16}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">Không tìm thấy đơn đặt phòng nào phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // ================= BẢNG ĐẶT DỊCH VỤ =================
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Mã Đơn</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Dịch vụ chọn</th>
                  <th className="p-4">Ngày đặt lịch</th>
                  <th className="p-4">Giờ hẹn</th>
                  <th className="p-4">Số khách</th>
                  <th className="p-4">Ghi chú</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceBookings.map(sb => (
                  <tr key={sb._id} className="border-b hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-800">{sb.bookingCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#0b142f]">{sb.user?.fullName}</div>
                      <div className="text-xs text-gray-500">{sb.user?.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-[#0b142f]">{sb.service?.serviceName || 'Dịch vụ đã xóa'}</div>
                      <div className="text-xs text-gray-500">{sb.service?.type}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-medium">
                      {new Date(sb.bookingDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-sm text-gray-800 font-bold">{sb.bookingTime}</td>
                    <td className="p-4 text-sm text-gray-600 font-bold">{sb.guests} người</td>
                    <td className="p-4 text-xs text-gray-500 max-w-[200px] truncate" title={sb.notes}>
                      {sb.notes || <span className="italic text-gray-300">Không có</span>}
                    </td>
                    <td className="p-4">{renderStatusBadge(sb.status)}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {sb.status === 'Chờ xác nhận' && (
                          <>
                            <button onClick={() => handleServiceStatusChange(sb._id, 'Đã xác nhận')} title="Xác nhận dịch vụ" className="text-gray-400 hover:text-green-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiCheckCircle size={16}/></button>
                            <button onClick={() => handleServiceStatusChange(sb._id, 'Đã hủy')} title="Hủy lịch dịch vụ" className="text-gray-400 hover:text-red-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiXCircle size={16}/></button>
                          </>
                        )}
                        {sb.status === 'Đã xác nhận' && (
                          <button onClick={() => handleServiceStatusChange(sb._id, 'Đã hủy')} title="Hủy đặt lịch" className="text-gray-400 hover:text-red-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm transition"><FiXCircle size={16}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredServiceBookings.length === 0 && (
                  <tr>
                    <td colSpan="9" className="p-8 text-center text-gray-500">Không tìm thấy đơn đặt lịch dịch vụ nào phù hợp.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;