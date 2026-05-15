const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const mongoose = require('mongoose');

const getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfLastWeek = new Date(startOfToday);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 6); // Lấy 7 ngày trước (bao gồm cả hôm nay)

        // 1. Tính tổng doanh thu (Những đơn không bị hủy)
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $ne: 'Đã hủy' } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // 2. Tính tổng số đơn đặt phòng
        const totalBookings = await Booking.countDocuments();

        // 3. Tính số phòng trống và tổng số phòng
        const totalRooms = await Room.countDocuments();
        const availableRooms = await Room.countDocuments({ status: 'Còntrống' });
        
        // 4. Khách hàng (Tổng số khách hàng)
        const totalCustomers = await User.countDocuments({ role: 'Client' });

        // 5. Biểu đồ doanh thu 7 ngày qua
        const revenueByDate = await Booking.aggregate([
            { 
                $match: { 
                    status: { $ne: 'Đã hủy' },
                    createdAt: { $gte: startOfLastWeek }
                } 
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    dailyRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        // Format lại dữ liệu biểu đồ
        // Tạo mảng 7 ngày để đảm bảo có đủ ngày dù ngày đó không có doanh thu
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(startOfToday);
            d.setDate(d.getDate() - i);
            const dayStr = `${d.getDate()}/${d.getMonth() + 1}`;
            
            // Tìm trong mảng revenueByDate xem ngày này có doanh thu ko
            const found = revenueByDate.find(r => 
                r._id.day === d.getDate() && 
                r._id.month === d.getMonth() + 1 && 
                r._id.year === d.getFullYear()
            );

            // Các thứ trong tiếng Việt (T2, T3, T4...)
            const dayOfWeek = d.getDay();
            const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

            chartData.push({
                date: dayStr,
                dayName: daysMap[dayOfWeek],
                revenue: found ? found.dailyRevenue : 0
            });
        }

        // 6. Trạng thái phòng
        const roomStatusCounts = await Room.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        let bookedOrOccupiedCount = 0;
        let cleaningCount = 0;
        let emptyCount = 0;

        roomStatusCounts.forEach(status => {
            if (status._id === 'Còntrống') emptyCount = status.count;
            if (status._id === 'Đã đặt' || status._id === 'Đang lưu trú') bookedOrOccupiedCount += status.count; // Phù hợp với UI gom Đã đặt/Đang ở
            if (status._id === 'Đang dọn dẹp') cleaningCount = status.count;
        });

        // 7. Danh sách đặt phòng gần đây (Lấy 5 đơn mới nhất)
        const recentBookings = await Booking.find()
            .populate('user', 'fullName email')
            .populate('room', 'roomName')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            kpis: {
                totalRevenue,
                totalBookings,
                totalRooms,
                availableRooms,
                totalCustomers
            },
            revenueChart: chartData,
            roomStatus: {
                total: totalRooms,
                booked: bookedOrOccupiedCount,
                cleaning: cleaningCount,
                empty: emptyCount
            },
            recentBookings
        });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu tổng quan' });
    }
};

module.exports = {
    getDashboardSummary
};
