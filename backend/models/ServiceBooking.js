const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
    bookingCode: { type: String, required: true, unique: true }, // VD: #SB-0001
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    guests: { type: Number, required: true, default: 1 },
    notes: { type: String, default: '' },
    status: { 
        type: String, 
        enum: ['Chờ xác nhận', 'Đã xác nhận', 'Đã hủy'], 
        default: 'Chờ xác nhận' 
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);
