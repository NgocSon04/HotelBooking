const ServiceBooking = require('../models/ServiceBooking');
const Service = require('../models/Service');

// Khách hàng đặt dịch vụ mới
exports.createServiceBooking = async (req, res) => {
    try {
        const { user, service, bookingDate, bookingTime, guests, notes } = req.body;
        
        // ==========================================
        // VALIDATE DỮ LIỆU ĐẦU VÀO CHO SERVICE BOOKING
        // ==========================================
        if (!user || !service || !bookingDate || !bookingTime || !guests) {
            return res.status(400).json({ message: "Thiếu thông tin đặt dịch vụ bắt buộc!" });
        }

        if (new Date(bookingDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
            return res.status(400).json({ message: "Ngày hẹn dịch vụ không thể ở quá khứ!" });
        }

        if (Number(guests) <= 0 || Number(guests) > 30) {
            return res.status(400).json({ message: "Số lượng khách đặt dịch vụ phải hợp lệ (từ 1 đến 30 người)!" });
        }

        // Kiểm tra dịch vụ có tồn tại không
        const serviceDoc = await Service.findById(service);
        if (!serviceDoc) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại" });
        }

        // ==========================================
        // LOGIC TẠO MÃ SERVICE BOOKING TỰ TĂNG (#SB-0001)
        // ==========================================
        let nextNumber = 1;
        const lastBooking = await ServiceBooking.findOne().sort({ createdAt: -1 });

        if (lastBooking && lastBooking.bookingCode && lastBooking.bookingCode.startsWith('#SB-')) {
            const lastNumberString = lastBooking.bookingCode.split('-')[1];
            const lastNumber = parseInt(lastNumberString, 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        const formattedNumber = nextNumber.toString().padStart(4, '0');
        const bookingCode = `#SB-${formattedNumber}`;

        // Tạo và lưu booking mới
        const newBooking = new ServiceBooking({
            bookingCode,
            user,
            service,
            bookingDate,
            bookingTime,
            guests: Number(guests),
            notes
        });

        await newBooking.save();
        res.status(201).json({ message: "Đặt dịch vụ thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi đặt dịch vụ:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi đặt dịch vụ" });
    }
};

// Lấy danh sách đặt dịch vụ của một khách hàng cụ thể
exports.getUserServiceBookings = async (req, res) => {
    try {
        const bookings = await ServiceBooking.find({ user: req.params.userId })
            .populate('service')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách lịch sử đặt dịch vụ" });
    }
};

// Admin lấy toàn bộ danh sách đặt dịch vụ
exports.getAllServiceBookings = async (req, res) => {
    try {
        const bookings = await ServiceBooking.find()
            .populate('user', 'fullName phone email')
            .populate('service')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải toàn bộ danh sách đặt dịch vụ" });
    }
};

// Admin cập nhật trạng thái (Duyệt, Hủy...)
exports.updateServiceBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await ServiceBooking.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật trạng thái đặt dịch vụ" });
    }
};
