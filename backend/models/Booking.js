const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingCode: { type: String, required: true, unique: true }, // Mã VD: #SQ-8901
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ai đặt?
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // Phòng nào?
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đang lưu trú', 'Đã trả phòng', 'Đã hủy'], 
        default: 'Chờ xác nhận' 
    },
    paymentMethod: { type: String, default: 'Tiền mặt' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);