const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff', 'Client'], default: 'Client' },
    status: { type: String, enum: ['Hoạt động', 'Đã khóa'], default: 'Hoạt động' },
    avatar: { type: String, default: 'https://i.pravatar.cc/150' } // Avatar mặc định
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);