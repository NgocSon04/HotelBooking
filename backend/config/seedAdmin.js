const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        // Kiểm tra xem đã có tài khoản Admin nào chưa
        const adminExists = await User.findOne({ role: 'Admin' });

        if (!adminExists) {
            // Nếu chưa có, tiến hành tạo mới
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const newAdmin = new User({
                fullName: 'Super Admin',
                email: 'admin123@gmail.com',
                password: hashedPassword,
                phone: '0123456789',
                role: 'Admin',
                status: 'Hoạt động'
            });

            await newAdmin.save();
            console.log('✅ Đã tạo tài khoản Admin mặc định thành công:');
            console.log('   - Tên đăng nhập/Email: admin123@gmail.com');
            console.log('   - Mật khẩu: admin123');
        } else {
            console.log('ℹ️ Tài khoản Admin đã tồn tại trong hệ thống.');
        }
    } catch (error) {
        console.error('❌ Lỗi khi tạo tài khoản Admin mặc định:', error.message);
    }
};

module.exports = seedAdmin;
