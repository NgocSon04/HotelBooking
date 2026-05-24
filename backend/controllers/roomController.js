const Room = require('../models/Room');
const Booking = require('../models/Booking');

// [GET] Lấy danh sách toàn bộ phòng (Tính toán động số lượng trống hôm nay)
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 }); // Sắp xếp phòng mới nhất lên đầu
        
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

        // Lấy tất cả các đơn đặt phòng hoạt động trong ngày hôm nay
        const activeBookingsToday = await Booking.find({
            status: { $in: ['Đã xác nhận', 'Đang lưu trú'] },
            checkIn: { $lte: endOfToday },
            checkOut: { $gt: startOfToday }
        });

        // Ánh xạ tính toán số lượng phòng trống thực tế
        const roomsWithAvailability = rooms.map(room => {
            const bookedCount = activeBookingsToday.filter(b => b.room.toString() === room._id.toString()).length;
            const availableCount = Math.max(0, (room.quantity || 5) - bookedCount);
            
            const roomObj = room.toObject();
            roomObj.bookedCountToday = bookedCount;
            roomObj.availableCountToday = availableCount;
            return roomObj;
        });

        res.status(200).json(roomsWithAvailability);
    } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
        res.status(500).json({ message: "Lỗi server khi lấy dữ liệu phòng" });
    }
};

// [POST] Thêm phòng mới (Đã bổ sung đầy đủ chi tiết)
exports.createRoom = async (req, res) => {
    try {
        // Lấy toàn bộ các trường thông tin từ req.body
        const { 
            roomName, roomType, price, quantity, 
            size, capacity, bedType, description, amenities 
        } = req.body;
        
        let imageUrls = []; 
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        }

        const newRoom = new Room({
            roomName, 
            roomType, 
            price, 
            quantity: quantity || 5,
            size,           // Diện tích
            capacity,       // Số người
            bedType,        // Loại giường
            description,    // Mô tả chi tiết
            amenities,      // Tiện ích (Mảng)
            images: imageUrls 
        });

        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        console.error("Lỗi thêm phòng:", error);
        res.status(400).json({ message: "Lỗi khi thêm phòng mới", error });
    }
};

// [PUT] Cập nhật phòng (Cập nhật mọi chi tiết)
exports.updateRoom = async (req, res) => {
    try {
        const { 
            roomName, roomType, price, quantity, 
            size, capacity, bedType, description, amenities 
        } = req.body;

        let updateData = { 
            roomName, roomType, price, quantity, 
            size, capacity, bedType, description, amenities 
        };
        
        // Nếu admin có upload thêm ảnh mới thì mới cập nhật mảng ảnh
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true } // Trả về dữ liệu mới nhất sau khi sửa
        );

        if (!updatedRoom) return res.status(404).json({ message: "Không tìm thấy phòng" });
        res.status(200).json(updatedRoom);
    } catch (error) {
        console.error("Lỗi cập nhật phòng:", error);
        res.status(400).json({ message: "Lỗi khi cập nhật phòng", error });
    }
};

// [DELETE] Xóa phòng
exports.deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: "Không tìm thấy phòng để xóa" });
        res.status(200).json({ message: "Đã xóa phòng thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa phòng", error });
    }
};

// [GET] Lấy chi tiết 1 phòng theo ID (Dùng cho trang Details phía Client)
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: "Không tìm thấy thông tin phòng" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống khi lấy chi tiết phòng", error });
    }
};