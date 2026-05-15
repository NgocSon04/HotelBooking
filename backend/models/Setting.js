const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    hotelName: { type: String, default: 'Sơn Quân Hotel' },
    slogan: { type: String, default: 'Trải nghiệm lưu trú đẳng cấp' },
    shortDescription: { type: String, default: 'Tọa lạc tại trung tâm thành phố, Sơn Quân Hotel mang đến không gian nghỉ dưỡng sang trọng, kết hợp hoàn hảo giữa thiết kế hiện đại và dịch vụ tận tâm.' },
    email: { type: String, default: 'contact@sonquanhotel.vn' },
    phone: { type: String, default: '+84 123 456 789' },
    address: { type: String, default: '123 Đường Ngọc Trai, Quận Hải Châu, TP. Đà Nẵng, Việt Nam' },
    paymentCash: { type: Boolean, default: true },
    paymentBankTransfer: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
