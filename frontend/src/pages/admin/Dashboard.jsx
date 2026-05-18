import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../services/dashboardService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiCalendar } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { HiOutlineUsers } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getDashboardSummary();
                setData(result);
            } catch (error) {
                console.error("Lỗi khi fetch dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Đang tải dữ liệu tổng quan...</div>;
    }

    if (!data) return <div>Không có dữ liệu.</div>;

    const { kpis, revenueChart, roomStatus, recentBookings } = data;

    // Format tiền VNĐ
    const formatCurrency = (value) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M ₫';
        }
        return value.toLocaleString('vi-VN') + ' ₫';
    };

    const COLORS = ['#0b142f', '#a18042', '#e5e7eb']; // Theo màu UI (Dark, Gold, Light Gray)
    const pieData = [
        { name: 'Đã đặt / Đang ở', value: roomStatus.booked },
        { name: 'Đang dọn dẹp', value: roomStatus.cleaning },
        { name: 'Trống', value: roomStatus.empty },
    ];

    return (
        <div className="space-y-6">
            {/* Tiêu đề & Cập nhật */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#0b142f]">Tổng quan hệ thống</h2>
                    <p className="text-sm text-gray-500 mt-1">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, Hôm nay</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        <FiCalendar className="w-4 h-4" /> Hôm nay
                    </button>
                    <button className="p-2 border rounded-lg hover:bg-gray-50 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    </button>
                </div>
            </div>

            {/* 4 Thẻ KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Doanh thu */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng doanh thu</p>
                            <h3 className="text-2xl font-bold text-[#0b142f] mt-1">{formatCurrency(kpis.totalRevenue)}</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <BiMoney className="w-6 h-6 text-[#0b142f]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-emerald-500 font-medium">
                        <FiTrendingUp /> <span>+12.5%</span> <span className="text-gray-400 font-normal text-xs ml-1">so với hôm qua</span>
                    </div>
                </div>

                {/* Đơn đặt */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng đơn đặt</p>
                            <h3 className="text-2xl font-bold text-[#0b142f] mt-1">{kpis.totalBookings}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <FiCalendar className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-emerald-500 font-medium">
                        <FiTrendingUp /> <span>+5 đơn mới</span>
                    </div>
                </div>

                {/* Phòng trống */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Phòng đang trống</p>
                            <h3 className="text-2xl font-bold text-[#0b142f] mt-1">{kpis.availableRooms}/{kpis.totalRooms}</h3>
                        </div>
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <MdOutlineMeetingRoom className="w-6 h-6 text-slate-600" />
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-[#0b142f] h-1.5 rounded-full" style={{ width: `${((kpis.totalRooms - kpis.availableRooms) / kpis.totalRooms) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tỷ lệ lấp đầy {Math.round(((kpis.totalRooms - kpis.availableRooms) / kpis.totalRooms) * 100)}%</p>
                </div>

                {/* Khách mới */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Khách mới</p>
                            <h3 className="text-2xl font-bold text-[#0b142f] mt-1">{kpis.totalCustomers}</h3>
                        </div>
                        <div className="p-2 bg-rose-50 rounded-lg">
                            <HiOutlineUsers className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-red-500 font-medium">
                        <FiTrendingDown /> <span>-2.1%</span> <span className="text-gray-400 font-normal text-xs ml-1">so với tuần trước</span>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-gray-700">Doanh thu 7 ngày qua</h3>
                        <button className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg></button>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="dayName" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : value}
                                />
                                <RechartsTooltip 
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString()} ₫`, 'Doanh thu']}
                                    labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Bar 
                                    dataKey="revenue" 
                                    fill="#0b142f" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={40}
                                >
                                    {revenueChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 4 ? '#a18042' : '#0b142f'} /> 
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center relative">
                    <h3 className="font-semibold text-gray-700 self-start w-full mb-2">Trạng thái phòng</h3>
                    <div className="flex-1 w-full min-h-0 relative flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="65%"
                                    outerRadius="85%"
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value, name, props) => [`${value} phòng (${Math.round((value / roomStatus.total) * 100)}%)`, name]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Text ở giữa Donut */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                            <span className="text-3xl font-bold text-[#0b142f]">{roomStatus.total}</span>
                            <span className="text-xs text-gray-500">Tổng số phòng</span>
                        </div>
                    </div>
                    
                    {/* Chú thích */}
                    <div className="w-full mt-2 space-y-2">
                        {pieData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                                <span className="font-medium text-gray-700">
                                    {item.value} <span className="text-gray-400 font-normal text-xs ml-1">({roomStatus.total > 0 ? Math.round((item.value / roomStatus.total) * 100) : 0}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bảng Danh sách đặt phòng gần đây */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Danh sách đặt phòng gần đây</h3>
                    <Link to="/admin/bookings" className="text-sm font-medium text-[#0b142f] hover:underline flex items-center gap-1">
                        Xem tất cả <span className="text-lg">→</span>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Mã đặt</th>
                                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                                <th className="px-6 py-4 font-semibold">Phòng</th>
                                <th className="px-6 py-4 font-semibold">Ngày nhận - trả</th>
                                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                                <th className="px-6 py-4 font-semibold text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentBookings.map((booking, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-sm text-[#0b142f]">{booking.bookingCode}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-800">{booking.user?.fullName}</div>
                                        <div className="text-xs text-gray-500">{booking.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{booking.room?.roomName}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-800">{new Date(booking.checkIn).toLocaleDateString('vi-VN')}</div>
                                        <div className="text-xs text-gray-500">{new Date(booking.checkOut).toLocaleDateString('vi-VN')}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-sm text-gray-800">
                                        {booking.totalPrice.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                            ${booking.status === 'Đã xác nhận' ? 'bg-green-100 text-green-700' : 
                                              booking.status === 'Chờ xác nhận' ? 'bg-amber-100 text-amber-700' : 
                                              booking.status === 'Đang lưu trú' ? 'bg-blue-100 text-blue-700' : 
                                              booking.status === 'Đã trả phòng' ? 'bg-gray-100 text-gray-700' :
                                              'bg-red-100 text-red-700'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-400 hover:text-gray-800">
                                            <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {recentBookings.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">Chưa có đơn đặt phòng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
