const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Kiểm tra email tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email này đã được sử dụng!" });

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới (mặc định role là Client)
        const newUser = new User({ fullName, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        // Kiểm tra tài khoản có bị khóa không
        if (user.status === 'Đã khóa') return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        // Tạo Token (Cần thêm JWT_SECRET vào file .env, ví dụ: JWT_SECRET=sonquanhotel123)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
};

// QUÊN MẬT KHẨU – Tạo OTP 6 số và trả về cho Frontend hiển thị (không gửi email)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Vui lòng nhập email!' });

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            // Không tiết lộ thông tin email có tồn tại hay không
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này!' });
        }

        // Tạo mã OTP 6 chữ số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP trước khi lưu vào DB (bảo mật)
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        // Lưu vào DB, hết hạn sau 10 phút
        user.resetPasswordToken = hashedOtp;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // Trả OTP gốc về cho Frontend hiển thị (môi trường dev/demo)
        res.status(200).json({
            message: 'Mã OTP đã được tạo thành công!',
            otp  // Trả về OTP để hiển thị popup (demo)
        });
    } catch (error) {
        console.error('Lỗi forgotPassword:', error);
        res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau.' });
    }
};

// ĐẶT LẠI MẬT KHẨU với OTP hợp lệ
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp!' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
        }

        // Hash OTP nhận từ Frontend để so sánh
        const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetPasswordToken: hashedOtp,
            resetPasswordExpires: { $gt: new Date() }  // OTP chưa hết hạn
        });

        if (!user) {
            return res.status(400).json({ message: 'Mã OTP không đúng hoặc đã hết hạn!' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Xóa OTP sau khi đã dùng
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.' });
    } catch (error) {
        console.error('Lỗi resetPassword:', error);
        res.status(500).json({ message: 'Lỗi server, vui lòng thử lại.' });
    }
};