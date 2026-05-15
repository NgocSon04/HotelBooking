const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Khách hàng đặt phòng mới
exports.createBooking = async (req, res) => {
    try {
        // Lấy dữ liệu từ Frontend gửi lên (Đã bổ sung paymentMethod)
        const { user, room, checkIn, checkOut, guests, totalPrice, paymentMethod, specialRequest, customerInfo } = req.body;
        
        // ==========================================
        // LOGIC KIỂM TRA SỐ LƯỢNG PHÒNG (INVENTORY)
        // ==========================================
        const roomDoc = await Room.findById(room);
        if (!roomDoc) {
            return res.status(404).json({ message: "Loại phòng không tồn tại" });
        }

        // Tìm các đơn đặt phòng của loại phòng này bị trùng ngày
        // Công thức trùng ngày: checkIn của DB < checkOut mới VÀ checkOut của DB > checkIn mới
        const overlappingBookings = await Booking.find({
            room: room,
            status: { $nin: ['Đã hủy', 'Đã trả phòng'] },
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
        });

        // Nếu số lượng người đã đặt bằng hoặc lớn hơn tổng số phòng khách sạn có
        if (overlappingBookings.length >= roomDoc.quantity) {
            return res.status(400).json({ 
                message: "Rất tiếc! Loại phòng này đã hết chỗ trong khoảng thời gian bạn chọn." 
            });
        }

        // ==========================================
        // LOGIC TẠO MÃ BOOKING TỰ TĂNG (#KH-0001)
        // ==========================================
        let nextNumber = 1; // Khởi tạo số mặc định là 1

        // 1. Tìm đơn đặt phòng gần nhất trong cơ sở dữ liệu
        const lastBooking = await Booking.findOne().sort({ createdAt: -1 });

        // 2. Nếu đã có đơn và mã cũ bắt đầu bằng '#KH-'
        if (lastBooking && lastBooking.bookingCode && lastBooking.bookingCode.startsWith('#KH-')) {
            // Tách lấy phần số (VD: '#KH-0005' -> '0005')
            const lastNumberString = lastBooking.bookingCode.split('-')[1];
            const lastNumber = parseInt(lastNumberString, 10);
            
            // Nếu là một số hợp lệ thì cộng thêm 1
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        // 3. Format lại để luôn có 4 chữ số (1 -> 0001, 15 -> 0015)
        const formattedNumber = nextNumber.toString().padStart(4, '0');
        const bookingCode = `#KH-${formattedNumber}`;

        // ==========================================
        // TẠO VÀ LƯU BOOKING MỚI
        // ==========================================
        const newBooking = new Booking({ 
            bookingCode, 
            user, 
            room, 
            checkIn, 
            checkOut, 
            guests, 
            totalPrice,
            paymentMethod,
            specialRequest,
            customerInfo
        });
        
        await newBooking.save();

        res.status(201).json({ message: "Đặt phòng thành công!", booking: newBooking });
    } catch (error) {
        console.error("Lỗi tạo booking:", error); // In lỗi ra console để dễ debug
        res.status(500).json({ message: "Lỗi hệ thống khi đặt phòng" });
    }
};

// Admin lấy toàn bộ danh sách đặt phòng
exports.getAllBookings = async (req, res) => {
    try {
        // Dùng populate để kéo thông tin từ bảng User và Room sang
        const bookings = await Booking.find()
            .populate('user', 'fullName phone email')
            .populate('room', 'roomName type price')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách" });
    }
};

// Admin cập nhật trạng thái (Duyệt, Hủy...)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
};

// Lấy lịch sử đặt phòng của một khách hàng cụ thể
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('room', 'roomName type images') // Lấy thêm ảnh và tên phòng
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải lịch sử đặt phòng" });
    }
};