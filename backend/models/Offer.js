const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Gói Combo', 'Mã giảm giá', 'Ưu đãi VIP'], required: true },
    image: { type: String }, // Có thể trống nếu là thẻ Mã giảm giá nền trắng
    promoCode: { type: String }, // Dành riêng cho category 'Mã giảm giá'
    discountValue: { type: Number, default: 0 }, // Giá trị giảm (Ví dụ: 20 cho 20% hoặc 50000 cho 50k)
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' }, // Loại giảm giá
    priceText: { type: String }, // Dành cho Combo (VD: "chỉ từ 4.500.000đ")
    tag: { type: String }, // VD: "MÙA HÈ RỰC RỠ"
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);