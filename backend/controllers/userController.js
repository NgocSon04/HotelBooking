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

// 4. Xóa User (Đã bị vô hiệu hóa - Chỉ cho phép Khóa tài khoản)
exports.deleteUser = async (req, res) => {
    try {
        res.status(400).json({ message: "Hệ thống không cho phép xóa tài khoản, vui lòng sử dụng chức năng Khóa tài khoản!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xử lý yêu cầu" });
    }
};

// 5. Lưu mã giảm giá
exports.saveOffer = async (req, res) => {
    try {
        const { offerId } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        if (!user.savedOffers) {
            user.savedOffers = [];
        }

        if (user.savedOffers.includes(offerId)) {
            return res.status(400).json({ message: "Ưu đãi này đã được lưu trước đó!" });
        }

        user.savedOffers.push(offerId);
        await user.save();
        res.status(200).json({ message: "Lưu ưu đãi thành công!", savedOffers: user.savedOffers });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lưu ưu đãi", error });
    }
};

// 6. Hủy lưu mã giảm giá
exports.removeOffer = async (req, res) => {
    try {
        const { offerId } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        if (user.savedOffers) {
            user.savedOffers = user.savedOffers.filter(id => id.toString() !== offerId);
            await user.save();
        }
        res.status(200).json({ message: "Hủy lưu ưu đãi thành công!", savedOffers: user.savedOffers || [] });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi hủy lưu ưu đãi", error });
    }
};

// 7. Lấy danh sách ưu đãi đã lưu
exports.getSavedOffers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('savedOffers');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        res.status(200).json(user.savedOffers || []);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ưu đãi đã lưu", error });
    }
};

// 8. Lấy thông tin chi tiết một User theo ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin tài khoản" });
    }
};

// 9. Cập nhật thông tin cá nhân (Profile & Mật khẩu)
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, phone, password, avatar } = req.body;
        const userId = req.params.id;

        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        
        if (req.file) {
            updateData.avatar = `http://localhost:5000/uploads/${req.file.filename}`;
        } else if (avatar) {
            updateData.avatar = avatar;
        }

        // Nếu có đổi mật khẩu mới
        if (password && password.trim() !== '') {
            if (password.length < 6) {
                return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            }
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } // Trả về data mới sau update
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        res.status(200).json({ 
            message: "Cập nhật thông tin cá nhân thành công!", 
            user: {
                id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                phone: updatedUser.phone
            }
        });
    } catch (error) {
        console.error("Lỗi cập nhật profile:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật thông tin cá nhân!" });
    }
};