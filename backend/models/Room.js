const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    roomType: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    quantity: { type: Number, default: 5 },     // Số lượng phòng của loại này
    
    // ======== CÁC TRƯỜNG MỚI BỔ SUNG CHO UI CLIENT ========
    size: { type: Number, default: 0 },         // Diện tích (m2)
    capacity: { type: Number, default: 2 },     // Số lượng khách tối đa
    bedType: { type: String, default: '1 giường lớn' }, // Loại giường
    description: { type: String, default: '' }, // Bài viết giới thiệu không gian
    amenities: [{ type: String }],              // Mảng tiện ích (VD: ['Wifi', 'Smart TV'])
    rating: { type: Number, default: 5.0 },     // Điểm đánh giá trung bình
    reviewsCount: { type: Number, default: 0 }  // Số lượt đánh giá
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);