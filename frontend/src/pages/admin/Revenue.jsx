import React, { useState, useEffect } from 'react';
import { getRevenueReport } from '../../services/revenueService';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { FiTrendingUp, FiCalendar, FiDownload } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import { MdOutlineConfirmationNumber, MdOutlinePriceChange } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Revenue = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Mặc định lấy tháng/năm hiện tại
    const currentDate = new Date();
    const [selectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getRevenueReport(selectedYear, selectedMonth);
                setData(result);
            } catch (error) {
                console.error("Lỗi khi fetch revenue data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedYear, selectedMonth]);

    // Format tiền VNĐ
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN') + ' ₫';
    };

    // Format tiền VNĐ rút gọn cho trục Y
    const formatYAxis = (value) => {
        if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B';
        if (value >= 1000000) return (value / 1000000).toFixed(0) + 'M';
        return value;
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full">Đang tải dữ liệu doanh thu...</div>;
    }

    if (!data) return <div>Không có dữ liệu.</div>;

    const { kpis, monthlyRevenueChart, bookingRatio, roomStats } = data;

    const PIE_COLORS = ['#0b142f', '#dc2626', '#e5e7eb']; // Dark Blue, Red, Light Gray
    const pieData = [
        { name: 'Thành công', value: bookingRatio.success },
        { name: 'Đã hủy', value: bookingRatio.cancelled },
        { name: 'Chờ duyệt', value: bookingRatio.pending },
    ];

    return (
        <div className="space-y-6">
            {/* Tiêu đề & Bộ lọc */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-[#0b142f]">Doanh thu</h2>
                    <p className="text-sm text-gray-500 mt-1">Tổng quan tài chính và báo cáo chi tiết</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select 
                            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-10 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-sm"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>Tháng Này (Tháng {m}, {selectedYear})</option>
                            ))}
                        </select>
                        <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                    <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm bg-white">
                        <FiDownload className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* 3 Thẻ KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tổng doanh thu */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng doanh thu</p>
                            <h3 className="text-3xl font-bold text-[#0b142f] mt-3">{formatCurrency(kpis.totalRevenue)}</h3>
                        </div>
                        <div className="p-2 bg-[#0b142f] rounded-full">
                            <BiMoney className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#a18042] font-medium mt-auto">
                        <FiTrendingUp /> <span>+12.5% so với tháng trước</span>
                    </div>
                </div>

                {/* Tổng lượt đặt phòng */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tổng lượt đặt phòng</p>
                            <h3 className="text-3xl font-bold text-[#0b142f] mt-3">{kpis.totalBookings}</h3>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdOutlineConfirmationNumber className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 font-medium mt-auto">
                        <FiTrendingUp /> <span>+5.2% so với tháng trước</span>
                    </div>
                </div>

                {/* Giá phòng TB (ADR) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Giá phòng TB (ADR)</p>
                            <h3 className="text-3xl font-bold text-[#0b142f] mt-3">{formatCurrency(kpis.adr)}</h3>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-full">
                            <MdOutlinePriceChange className="w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 font-medium mt-auto">
                        <span className="text-gray-400">→</span> <span>Ổn định so với tháng trước</span>
                    </div>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-semibold text-[#0b142f]">Doanh thu theo tháng</h3>
                        <div className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer">
                            Năm {selectedYear} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyRevenueChart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={formatYAxis}
                                />
                                <RechartsTooltip 
                                    cursor={{ fill: '#f8fafc' }}
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
                                    {monthlyRevenueChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index + 1 === selectedMonth ? '#a18042' : '#0b142f'} /> 
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col relative">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-[#0b142f]">Tỷ lệ Booking</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                        </button>
                    </div>
                    <div className="flex-1 w-full min-h-0 relative flex justify-center items-center -mt-4">
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
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value, name) => [`${value} đơn (${bookingRatio.total > 0 ? Math.round((value / bookingRatio.total) * 100) : 0}%)`, name]}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Text ở giữa Donut */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-[#0b142f]">
                                {bookingRatio.total > 0 ? Math.round((bookingRatio.success / bookingRatio.total) * 100) : 0}%
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Thành công</span>
                        </div>
                    </div>
                    
                    {/* Chú thích */}
                    <div className="w-full space-y-4 pb-2">
                        {pieData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></span>
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-500">
                                    {bookingRatio.total > 0 ? Math.round((item.value / bookingRatio.total) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bảng Thống kê doanh thu theo loại phòng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#0b142f]">Thống kê doanh thu theo loại phòng</h3>
                    <Link to="/admin/rooms" className="text-sm font-medium text-[#a18042] hover:underline flex items-center gap-1">
                        Xem tất cả <span className="text-lg">→</span>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4">Loại phòng</th>
                                <th className="px-6 py-4">Số lượng bán</th>
                                <th className="px-6 py-4">Khách phục vụ</th>
                                <th className="px-6 py-4">Giá trung bình</th>
                                <th className="px-6 py-4">Tổng doanh thu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {roomStats.map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-medium text-sm text-[#0b142f]">{stat.roomType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{stat.sold}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{stat.capacity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatCurrency(stat.avgPrice)}</td>
                                    <td className="px-6 py-4 font-bold text-sm text-[#0b142f]">
                                        {formatCurrency(stat.totalRevenue)}
                                    </td>
                                </tr>
                            ))}
                            {roomStats.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Chưa có dữ liệu thống kê loại phòng trong tháng này</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Revenue;
