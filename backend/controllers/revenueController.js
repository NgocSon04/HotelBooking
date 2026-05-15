const Booking = require('../models/Booking');
const Room = require('../models/Room');
const mongoose = require('mongoose');

const getRevenueReport = async (req, res) => {
    try {
        const queryYear = parseInt(req.query.year) || new Date().getFullYear();
        const queryMonth = parseInt(req.query.month) || new Date().getMonth() + 1;

        // 1. Dữ liệu cho tháng đang chọn
        const startOfMonth = new Date(queryYear, queryMonth - 1, 1);
        const endOfMonth = new Date(queryYear, queryMonth, 0, 23, 59, 59, 999);

        // Lấy tất cả booking trong tháng
        const monthlyBookings = await Booking.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('room');

        let totalRevenue = 0;
        let totalBookingsCount = monthlyBookings.length;
        
        // Thống kê trạng thái (Thành công, Đã hủy, Chờ duyệt)
        let successCount = 0;
        let cancelledCount = 0;
        let pendingCount = 0;

        // Thống kê theo loại phòng
        const roomStatsMap = {};

        monthlyBookings.forEach(booking => {
            // Gom nhóm trạng thái
            if (['Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng'].includes(booking.status)) {
                successCount++;
                totalRevenue += booking.totalPrice; // Chỉ tính doanh thu cho đơn thành công
            } else if (booking.status === 'Đã hủy') {
                cancelledCount++;
            } else if (booking.status === 'Chờ xác nhận') {
                pendingCount++;
            }

            // Gom nhóm theo loại phòng (chỉ tính đơn thành công cho doanh thu)
            if (booking.room) {
                const rType = booking.room.roomType;
                if (!roomStatsMap[rType]) {
                    roomStatsMap[rType] = { count: 0, revenue: 0, capacitySold: 0 };
                }
                
                // Đếm tất cả lượt bán phòng (không phân biệt trạng thái để tính tổng số lượng bán, nhưng doanh thu chỉ tính đơn thành công)
                if (['Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng'].includes(booking.status)) {
                    roomStatsMap[rType].count += 1;
                    roomStatsMap[rType].revenue += booking.totalPrice;
                    roomStatsMap[rType].capacitySold += booking.guests; // Tạm dùng số khách để tính hiệu suất
                }
            }
        });

        // Tính ADR = Tổng Doanh Thu / Tổng số lượng phòng bán được (thành công)
        let totalSuccessfulBookings = successCount;
        const adr = totalSuccessfulBookings > 0 ? totalRevenue / totalSuccessfulBookings : 0;

        // Chuyển roomStatsMap thành array
        const roomStats = Object.keys(roomStatsMap).map(key => {
            const data = roomStatsMap[key];
            return {
                roomType: key,
                sold: data.count,
                capacity: data.capacitySold, // Thực ra đây là số khách, công suất chuẩn khó tính hơn do không có tổng số ngày
                avgPrice: data.count > 0 ? data.revenue / data.count : 0,
                totalRevenue: data.revenue
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue); // Sắp xếp theo doanh thu giảm dần

        // 2. Dữ liệu cho biểu đồ 12 tháng của NĂM
        const startOfYear = new Date(queryYear, 0, 1);
        const endOfYear = new Date(queryYear, 11, 31, 23, 59, 59, 999);

        const yearlyRevenueAggr = await Booking.aggregate([
            { 
                $match: { 
                    status: { $in: ['Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng'] },
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                } 
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    monthlyTotal: { $sum: "$totalPrice" }
                }
            }
        ]);

        const monthlyRevenueChart = Array.from({ length: 12 }, (_, i) => {
            const monthAggr = yearlyRevenueAggr.find(a => a._id.month === i + 1);
            return {
                name: `T${i + 1}`,
                revenue: monthAggr ? monthAggr.monthlyTotal : 0
            };
        });

        res.status(200).json({
            kpis: {
                totalRevenue,
                totalBookings: totalBookingsCount,
                adr
            },
            monthlyRevenueChart,
            bookingRatio: {
                total: totalBookingsCount,
                success: successCount,
                cancelled: cancelledCount,
                pending: pendingCount
            },
            roomStats
        });

    } catch (error) {
        console.error('Lỗi khi lấy báo cáo doanh thu:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy báo cáo doanh thu' });
    }
};

module.exports = {
    getRevenueReport
};
