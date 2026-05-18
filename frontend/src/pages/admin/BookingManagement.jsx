import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiDownload, FiCheckCircle, FiXCircle, FiLogOut, FiLogIn } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings/admin');
      setBookings(res.data);
    } catch (err) { toast.error("Lỗi tải danh sách booking!"); }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status: newStatus });
      toast.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
      fetchBookings();
    } catch (error) { toast.error("Cập nhật thất bại!"); }
  };

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Chờ xác nhận': return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>Chờ xác nhận</span>;
      case 'Đã xác nhận': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>Đã xác nhận</span>;
      case 'Đang lưu trú': return <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>Đang lưu trú</span>;
      case 'Đã trả phòng': return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>Đã trả phòng</span>;
      default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách Đặt phòng</h1>
          <p className="text-gray-500 text-sm">Quản lý và cập nhật trạng thái các giao dịch lưu trú.</p>
        </div>
        <button className="bg-[#8c6b23] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#7a5c1e] transition shadow-md">
          + Tạo Booking Mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-4 bg-white items-center">
          <div className="flex bg-gray-50 border rounded-lg px-3 py-2 w-72">
            <FiSearch className="text-gray-400 mt-1 mr-2"/>
            <input type="text" placeholder="Tìm theo Mã, Tên khách..." className="outline-none w-full text-sm bg-transparent"/>
          </div>
          <select className="border rounded-lg px-4 py-2 text-sm outline-none bg-gray-50">
            <option>Tất cả trạng thái</option>
            <option>Chờ xác nhận</option>
            <option>Đã xác nhận</option>
          </select>
          <input type="date" className="border rounded-lg px-4 py-2 text-sm outline-none bg-gray-50 text-gray-600" />
          <button className="ml-auto flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            <FiDownload /> Xuất file
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-500 font-bold">
            <tr>
              <th className="p-4">Mã Booking</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Phòng</th>
              <th className="p-4">Ngày C/In - C/Out</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thanh toán</th> {/* CỘT MỚI: THANH TOÁN */}
              <th className="p-4">Tổng tiền</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(bk => (
              <tr key={bk._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-bold text-gray-800">{bk.bookingCode}</td>
                <td className="p-4">
                  <div className="font-bold text-sm text-[#0b142f]">{bk.user?.fullName}</div>
                  <div className="text-xs text-gray-500">{bk.user?.phone}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-sm text-[#0b142f]">{bk.room?.roomName || 'Phòng đã xóa'}</div>
                  <div className="text-xs text-gray-500">{bk.room?.type}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  <div className="font-medium">{new Date(bk.checkIn).toLocaleDateString('vi-VN')} 14:00</div>
                  <div className="text-xs">{new Date(bk.checkOut).toLocaleDateString('vi-VN')} 12:00</div>
                </td>
                <td className="p-4">
                  {renderStatusBadge(bk.status)}
                </td>
                
                {/* DỮ LIỆU CỘT THANH TOÁN */}
                <td className="p-4">
                  {bk.paymentMethod === 'VNPay' ? (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-200">VNPay</span>
                  ) : (
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200">Tiền mặt</span>
                  )}
                </td>

                <td className="p-4 font-bold text-gray-800">
                  {bk.totalPrice?.toLocaleString()} đ
                </td>
                <td className="p-4 flex justify-center gap-3">
                  {bk.status === 'Chờ xác nhận' && (
                    <>
                      <button onClick={() => handleStatusChange(bk._id, 'Đã xác nhận')} title="Xác nhận" className="text-gray-400 hover:text-green-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm"><FiCheckCircle size={16}/></button>
                      <button onClick={() => handleStatusChange(bk._id, 'Đã hủy')} title="Hủy" className="text-gray-400 hover:text-red-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm"><FiXCircle size={16}/></button>
                    </>
                  )}
                  {bk.status === 'Đã xác nhận' && (
                    <button onClick={() => handleStatusChange(bk._id, 'Đang lưu trú')} title="Check-in" className="text-gray-400 hover:text-indigo-600 border border-gray-200 p-1.5 rounded-full bg-white shadow-sm"><FiLogIn size={16}/></button>
                  )}
                  {bk.status === 'Đang lưu trú' && (
                    <button onClick={() => handleStatusChange(bk._id, 'Đã trả phòng')} title="Check-out" className="text-gray-400 hover:text-[#8c6b23] border border-gray-200 p-1.5 rounded-full bg-white shadow-sm"><FiLogOut size={16}/></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;