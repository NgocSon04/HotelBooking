const Booking = require('../models/Booking');
const Room = require('../models/Room');
const mongoose = require('mongoose');

const getRevenueReport = async (req, res) => {
    try {
        const { type = 'month', year, month, startDate, endDate } = req.query;
        
        let start, end;
        let chartMap = {};
        let groupByType = 'day'; // 'day' hoặc 'month'

        const currentYear = parseInt(year) || new Date().getFullYear();
        const currentMonth = parseInt(month) || new Date().getMonth() + 1;

        if (type === 'day') {
            // Theo khoảng ngày
            if (!startDate || !endDate) {
                return res.status(400).json({ message: "Thiếu tham số startDate hoặc endDate cho thống kê theo ngày!" });
            }
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            // Tạo các ngày trong khoảng ngày để làm khung biểu đồ
            let temp = new Date(start);
            while (temp <= end) {
                const key = temp.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                chartMap[key] = 0;
                temp.setDate(temp.getDate() + 1);
            }
            groupByType = 'day';
        } else if (type === 'year') {
            // Theo năm
            start = new Date(currentYear, 0, 1);
            end = new Date(currentYear, 11, 31, 23, 59, 59, 999);

            // Tạo 12 tháng làm khung biểu đồ
            for (let m = 1; m <= 12; m++) {
                chartMap[`T${m}`] = 0;
            }
            groupByType = 'month';
        } else {
            // Theo tháng (mặc định)
            start = new Date(currentYear, currentMonth - 1, 1);
            end = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

            // Tạo các ngày trong tháng làm khung biểu đồ
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const dayStr = d < 10 ? `0${d}` : `${d}`;
                const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
                chartMap[`${dayStr}/${monthStr}`] = 0;
            }
            groupByType = 'day';
        }

        // Lấy tất cả bookings trong khoảng thời gian xác định
        const bookings = await Booking.find({
            createdAt: { $gte: start, $lte: end }
        }).populate('room');

        let totalRevenue = 0;
        let totalBookingsCount = bookings.length;
        let successCount = 0;
        let cancelledCount = 0;
        let pendingCount = 0;
        const roomStatsMap = {};

        bookings.forEach(booking => {
            const isSuccess = ['Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng'].includes(booking.status);
            
            // Gom nhóm trạng thái
            if (isSuccess) {
                successCount++;
                totalRevenue += booking.totalPrice;
                
                // Gom nhóm doanh thu cho biểu đồ
                const bookingDate = new Date(booking.createdAt);
                let chartKey = '';
                if (groupByType === 'month') {
                    chartKey = `T${bookingDate.getMonth() + 1}`;
                } else {
                    chartKey = bookingDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                }

                if (chartMap[chartKey] !== undefined) {
                    chartMap[chartKey] += booking.totalPrice;
                }
            } else if (booking.status === 'Đã hủy') {
                cancelledCount++;
            } else if (booking.status === 'Chờ xác nhận') {
                pendingCount++;
            }

            // Gom nhóm theo loại phòng
            if (booking.room) {
                const rType = booking.room.roomType;
                if (!roomStatsMap[rType]) {
                    roomStatsMap[rType] = { count: 0, revenue: 0, capacitySold: 0 };
                }
                
                if (isSuccess) {
                    roomStatsMap[rType].count += 1;
                    roomStatsMap[rType].revenue += booking.totalPrice;
                    roomStatsMap[rType].capacitySold += booking.guests;
                }
            }
        });

        // Tính ADR
        const adr = successCount > 0 ? totalRevenue / successCount : 0;

        // Chuyển roomStatsMap thành array
        const roomStats = Object.keys(roomStatsMap).map(key => {
            const data = roomStatsMap[key];
            return {
                roomType: key,
                sold: data.count,
                capacity: data.capacitySold,
                avgPrice: data.count > 0 ? data.revenue / data.count : 0,
                totalRevenue: data.revenue
            };
        }).sort((a, b) => b.totalRevenue - a.totalRevenue);

        // Chuyển chartMap thành array
        const revenueChart = Object.keys(chartMap).map(key => ({
            name: key,
            revenue: chartMap[key]
        }));

        res.status(200).json({
            kpis: {
                totalRevenue,
                totalBookings: totalBookingsCount,
                adr
            },
            revenueChart,
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
