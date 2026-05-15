const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. Lấy danh sách toàn bộ User
exports.getAllUsers = async (req, res) => {
    try {
        // select('-password') để không trả về password đã mã hóa cho frontend
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi tải danh sách tài khoản" });
    }
};

// 2. Thêm User mới (Admin thao tác)
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role, status } = req.body;

        // Kiểm tra trùng email
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            fullName, 
            email, 
            phone, 
            password: hashedPassword, 
            role: role || 'Client', 
            status: status || 'Hoạt động' 
        });
        await newUser.save();

        res.status(201).json({ message: "Thêm tài khoản thành công!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm tài khoản" });
    }
};

// 3. Cập nhật thông tin User
exports.updateUser = async (req, res) => {
    try {
        const { fullName, phone, role, status } = req.body;
        
        // Cập nhật thông tin (Bỏ qua email và password để bảo mật cơ bản)
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, phone, role, status },
            { new: true } // Trả về data mới sau khi update
        ).select('-password');

        res.status(200).json({ message: "Cập nhật thành công!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật tài khoản" });
    }
};

// 4. Xóa User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa tài khoản thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa tài khoản" });
    }
};