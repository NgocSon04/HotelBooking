const User = require('../models/User');

// Lấy danh sách cho trang Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách tài khoản" });
    }
};
// Sẽ thêm hàm khóa/mở khóa tài khoản sau