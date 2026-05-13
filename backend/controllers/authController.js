const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
};